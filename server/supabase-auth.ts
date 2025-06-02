import { createClient } from '@supabase/supabase-js';
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
// Import User type from storage or shared schema if needed for Express.User extension
// import { User as DBUser } from "@shared/schema"; // Assuming User is exported from schema

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string; // Store database user ID as string
      email: string;
      role?: string;
    }
  }
}

// If you are using req.user, uncomment and adjust this
// declare global {
//   namespace Express {
//     // Extend the Express.User interface to match your database User type
//     // if you plan to attach the full user object to req.user.
//     // Otherwise, you can remove this if you only use req.session.user
//     interface User {
//       id: number; // DB user ID is likely a number
//       email: string;
//       username: string; // Added username based on your DB structure
//       fullName?: string | null; // Based on your DB structure
//       roleId: number; // Store roleId as number from DB
//       isActive: boolean; // Include relevant fields
//       isEmailVerified: boolean;
//       authUserId: string; // Supabase Auth ID
//       // Add other fields from your DB User type...
//     }
//   }
// }


// Create Supabase client with anon key for operations
// Note: For backend operations like createUser *without* email confirmation,
// or bypassing RLS, you would typically use the Service Role Key here.
// The anon key is generally for client-side use where RLS applies.
// Using anon key for signUp triggers default Supabase email confirmation flow.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!, // Consider using process.env.SUPABASE_SERVICE_ROLE_KEY! here for admin functions
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Create Supabase client for regular operations (used for user-facing auth calls like signInWithPassword, signUp)
// Anon key is appropriate here as these operations are often client-initiated or behave like it.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export function setupSupabaseAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
       secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
       httpOnly: true,
       sameSite: 'lax' as const, // Or 'strict' or 'none' depending on your needs
       // maxAge: 24 * 60 * 60 * 1000 // Example: 24 hours
    }
  };

  app.set("trust proxy", 1); // Needed if behind a proxy like Nginx or Heroku
  app.use(session(sessionSettings));

  // Middleware to potentially load user data from DB based on session (Optional)
  // app.use(async (req, res, next) => {
  //    if (req.session?.user?.id) {
  //         try {
  //             // Convert session ID string to number for storage lookup
  //             const userId = Number(req.session.user.id);
  //             if (!isNaN(userId)) {
  //                 const dbUser = await storage.getUser(userId);
  //                 if (dbUser && dbUser.isActive) { // Check if active
  //                      // Attach the full user object to the request if you want to use req.user later
  //                      // req.user = dbUser as Express.User; // Requires casting and Express.User extension
  //                      console.log(`Middleware: Loaded user ${dbUser.id} from DB.`);
  //                 } else {
  //                      console.warn(`Middleware: User ID ${userId} from session not found or inactive in DB. Destroying session.`);
  //                      req.session.destroy(() => {}); // Clear invalid session
  //                 }
  //             } else {
  //                  console.warn(`Middleware: Invalid user ID in session (not a number): ${req.session.user.id}. Destroying session.`);
  //                  req.session.destroy(() => {}); // Clear invalid session
  //             }
  //         } catch (err) {
  //             console.error("Middleware: Error loading user from DB based on session:", err);
  //             req.session.destroy(() => {}); // Clear session on DB error
  //         }
  //    }
  //    next();
  // });


  // Register endpoint - creates user in Supabase Auth and our database
  app.post("/api/register", async (req, res) => {
    try {
      // Safely access properties from req.body
      const email = req.body?.email;
      const password = req.body?.password;
      const username = req.body?.username;
      const fullName = req.body?.fullName;
      const role = req.body?.role ?? 'user'; // Default role

      console.log('Registration attempt:', { email, username, role });

      // Basic validation *after* safely accessing
      if (!email || typeof email !== 'string' || !password || typeof password !== 'string' || !username || typeof username !== 'string') {
           console.warn('Registration failed: Missing or invalid types for email, password, or username.');
           return res.status(400).json({ error: "Email, password, and username are required and must be strings." });
      }


      // Check if user already exists in our database by username
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        console.warn(`Registration failed: Username "${username}" already exists.`);
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists in our database
      let existingUserByEmail = null;
      try {
         existingUserByEmail = await storage.getUserByEmail(email);
      } catch (err) {
         console.warn("storage.getUserByEmail might not be fully implemented or threw an error:", err);
         // Decide how critical this is. If your storage must guarantee email uniqueness, re-throw or return error.
      }
      if (existingUserByEmail) {
         console.warn(`Registration failed: Email "${email}" already exists in database.`);
         return res.status(400).json({ error: "Email already exists" });
      }


      // Create user in Supabase Auth MemStorage.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { // Optional: Store additional data in Supabase Auth user metadata
            username,
            full_name: fullName, // Note: Supabase metadata keys are often snake_case
            role // Storing role here can be useful for RLS or client-side logic
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error during signup:', authError);
        // Provide user-friendly error messages
        if (authError.message.includes('already registered')) {
             return res.status(400).json({ error: 'Email is already registered.' });
        }
         if (authError.message.includes('Email rate limit exceeded')) {
             return res.status(429).json({ error: 'Too many signup attempts. Please try again later.' });
         }
         // Catch password constraints errors etc.
         if (authError.message.includes('Password should be')) {
              return res.status(400).json({ error: authError.message });
         }
        return res.status(400).json({ error: authError.message });
      }

       // Check for the user object returned by Supabase Auth
       if (!authData.user) {
           console.error('Supabase Auth signup succeeded but returned no user object.');
            // This can happen if email confirmation is required and auto-sign-in is off.
            // The account was created in Supabase Auth, but not verified/signed in.
            // We still need the auth ID to link to our DB.
             // Depending on Supabase version/settings, data.user might be null but data.user.id available...
             // Or data might just contain { user: null, session: null }.
             // If data.user is null, getting the auth ID requires finding the user by email using the Supabase Admin API,
             // which would mean using supabaseAdmin with the service_role key.
             // For simplicity here, let's assume data.user is present if no authError occurs,
             // but handle the case where session is null.
             return res.status(500).json({ error: "Failed to retrieve user data from authentication system after creation." });
       }

       const supabaseAuthUserId = authData.user.id; // Get the Supabase Auth UUID


      console.log('User created in Supabase Auth with ID:', supabaseAuthUserId);

      // Map role names to role IDs
      const getRoleId = (roleName: string): number => {
        switch (roleName.toLowerCase()) {
          case 'admin': return 1;
          case 'hotel_owner':
          case 'hotel': return 2;
          case 'travel_agent':
          case 'agent': return 3;
          case 'user':
          default: return 4;
        }
      };

      // Hash password for our database (Optional but used in your storage example)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in our database with auth_user_id reference
      // Use the Supabase Auth ID (UUID) as the link to your DB user
      const userDataForDb: InsertUser = {
        email,
        password: hashedPassword, // Store hashed password if your DB schema requires it
        username,
        fullName: fullName ?? null, // Ensure nullable type matches schema
        roleId: getRoleId(role),
        isActive: true, // Default to active, adjust based on your verification flow
        isEmailVerified: authData.user.email_confirmed_at !== null, // Use Supabase confirmation status
        authUserId: supabaseAuthUserId,
         // Other fields from InsertUser should be provided or have defaults in your storage method
      };

      const userInDb = await storage.createUser(userDataForDb);

      console.log('User created in database:', {
        id: userInDb.id,
        email: userInDb.email,
        username: userInDb.username,
        roleId: userInDb.roleId,
        authUserId: userInDb.authUserId
      });

      // Store session *only* if Supabase also returned a session (means user was auto-signed-in)
      if (authData.session && authData.user) {
         // Determine role based on roleId from the database user object
         const roleMap: { [key: number]: string } = { 1: 'admin', 2: 'hotel', 3: 'agent', 4: 'user' };
         const userRole = roleMap[userInDb.roleId] || 'user';

         // Store minimal user data in the session
          req.session.user = {
            id: userInDb.id.toString(), // Store the database user ID (as string for session)
            email: userInDb.email,
            role: userRole // Use the role from your database user object
          };
           console.log('Session set for new user:', req.session.user);

           // Respond with user data and success message
           res.status(201).json({
              id: userInDb.id,
              email: userInDb.email,
              username: userInDb.username,
              fullName: userInDb.fullName,
              role: userRole, // Respond with the determined role
              message: 'Registration successful and logged in.'
           });

      } else {
         // If no session returned by Supabase, user likely needs to confirm email
          console.log('Registration successful, email verification required.');
          // Respond with user data from DB, but indicate verification is pending.
          res.status(201).json({
            id: userInDb.id,
            email: userInDb.email,
            username: userInDb.username,
            fullName: userInDb.fullName,
            role: role, // Respond with the requested role
            message: 'Registration successful. Please check your email to verify your account.'
          });
      }


    } catch (error) {
      console.error('Registration error details:', error);
      // console.error('Request body:', req.body); // Avoid logging sensitive data in production
      // Provide a generic error for unexpected issues
      res.status(500).json({ error: 'Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  // Login endpoint - signs in with Supabase Auth and our database
  app.post("/api/login", async (req, res) => {

    try {
      // Safely access properties from req.body
      // *** CHANGE loginId to username to match the UI label and likely client key ***
      const username = req.body?.username;
      const password = req.body?.password;

      console.log('Login attempt:', { username }); // Log the key name being used

      // Basic validation *after* safely accessing
      // *** Update validation check to use 'username' ***
      if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
          console.warn('Login attempt failed: Missing username or password in body or incorrect type.');
          return res.status(400).json({ error: "Username/Email and passweord are required." });
      }


      // Determine if the input 'username' is actually an email or a username
      // *** Use the 'username' variable here ***
      const isEmail = username.includes('@');
      let emailToAuthenticate = username; // Start assuming the input is the email
      let userFromDb; // Variable to hold user data from our database


      // If the input looks like a username (doesn't contain '@')
      if (!isEmail) {
        console.log(`Login identifier "${username}" is likely a username.`);
        // Find the user in our DB by username to get their email for Supabase auth
        userFromDb = await storage.getUserByUsername(username);
        if (!userFromDb) {
          // User not found by username in our DB
          console.log(`Login attempt failed: Username "${username}" not found in database.`);
          return res.status(401).json({ error: 'Invalid username or password' }); // Use 401 for authentication failure
        }
        // If found by username, use the email from our DB for Supabase authentication
        emailToAuthenticate = userFromDb.email;
        console.log(`Found email "${emailToAuthenticate}" for username "${username}".`);
      } else {
          // If the input looks like an email
          emailToAuthenticate = username; // The input is already the email
          console.log(`Login identifier "${username}" is an email.`);
           // Optional: Check if email exists in our DB MemStorage..
           // This can prevent authenticating a user in Supabase Auth who shouldn't exist in your app's DB.
            try {
                // Try fetching by email first if the input *is* an email
                userFromDb = await storage.getUserByEmail(username);
                if (!userFromDb) {
                    console.warn(`Email "${username}" not found in database storage *before* Supabase auth.`);
                    // Decide if you want to prevent login here, or allow Supabase auth and then handle the missing DB user.
                    // Allowing Supabase auth first is generally more flexible.
                }
            } catch (err) {
                console.error("Error checking email existence in storage during login:", err);
                // Log and proceed
            }
      }


      // Authenticate with Supabase using the determined email
      console.log(`Authenticating with Supabase using email: "${emailToAuthenticate}"`);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToAuthenticate,
        password: password
      });

      if (authError) {
        console.error('Supabase auth error during signin:', authError);
         // Return generic error message for security reasons
         if (authError.message.includes('Email not confirmed')) {
             console.log('Login attempt failed: Email not confirmed for user with email', emailToAuthenticate);
             return res.status(401).json({ error: 'Please confirm your email address before logging in.' });
         }
         // 'Invalid login credentials' is the common message for wrong email/password combo
         if (authError.message.includes('Invalid login credentials')) {
              console.log('Login attempt failed: Invalid credentials for email', emailToAuthenticate);
              return res.status(401).json({ error: 'Invalid username or password' }); // Generic message
         }
         // Handle other specific Supabase errors if needed
         console.log('Login attempt failed with unknown Supabase error:', authError.message);
        return res.status(401).json({ error: 'Authentication failed.' });
      }

      if (!authData.user || !authData.session) {
        console.error('Authentication failed: Supabase returned no user object or session.');
         // This could happen if email is not confirmed and auto-sign-in on confirmation is off.
         if (authData.user && !authData.user.email_confirmed_at) {
              console.log('Login attempt failed: Email not confirmed for user', authData.user.id);
              return res.status(401).json({ error: 'Please confirm your email address.' });
         }
         // Catch other unexpected scenarios
        return res.status(500).json({ error: 'Authentication failed. Please try again.' });
      }

      console.log('User authenticated with Supabase Auth ID:', authData.user.id);

      // *** Crucial step: Find the user in our database using the Supabase Auth ID ***
      const userInDb = await storage.getUserByAuthId(authData.user.id);

      if (!userInDb) {
        console.error('Data inconsistency: User authenticated with Supabase Auth ID', authData.user.id, 'but not found in database.');
        // This indicates a data inconsistency. Log this as a critical error.
        // You might want to automatically create the user here based on Supabase data,
        // or flag this as an issue requiring manual intervention.
        // For now, deny access and sign out of Supabase Auth.
        await supabase.auth.signOut(); // Invalidate Supabase token(s) on the server side
        return res.status(500).json({ error: 'User profile not found. Please contact support.' });
      }

       // Perform application-level checks (e.g., is user active?)
       if (!userInDb.isActive) {
           console.warn('Login attempt failed: User is inactive in database for Auth ID:', authData.user.id);
           await supabase.auth.signOut(); // Sign out if account is inactive
           return res.status(401).json({ error: 'Your account is inactive. Please contact support.' });
       }
        // You might also check userInDb.isEmailVerified if your app requires it for certain actions.

      // Determine role based on roleId from our database user object
      const roleMap: { [key: number]: string } = { 1: 'admin', 2: 'hotel', 3: 'agent', 4: 'user' };
      const userRole = roleMap[userInDb.roleId] || 'user';

      // Store minimal user data from our database in the session
      req.session.user = {
        id: userInDb.id.toString(), // Store database user ID (as string)
        email: userInDb.email, // Use email from our DB
        role: userRole // Use role from our DB
      };

      console.log('Session set for user:', req.session.user);

       // Optional: Update last login timestamp in your database
       // try {
       //      await db.update(users).set({ lastLogin: new Date(), updatedAt: new Date() }).where(eq(users.id, userInDb.id));
       //      console.log(`Updated last login for user ID ${userInDb.id}`);
       // } catch (dbErr) {
       //      console.error(`Failed to update last login for user ID ${userInDb.id}:`, dbErr);
       //      // Continue login flow despite DB update error
       // }


      // Respond with user data from our database
      res.status(200).json({
        id: userInDb.id,
        email: userInDb.email,
        username: userInDb.username, // Include username from our DB
        fullName: userInDb.fullName, // Include fullName from our DB
        role: userRole // Include determined role
        // Do not expose sensitive data like password hash, authUserId, etc.
      });
    } catch (error) {
      console.error('Login error:', error);
      // Catch any unexpected errors during the process
      // Provide a generic error for internal server errors
      res.status(500).json({ error: 'An internal error occurred during login. Please try again later.' });
    }
  });


  // Logout endpoint
  app.post("/api/logout", async (req, res) => {
    console.log('Logout attempt.');
    // Destroy the server-side session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error during logout:', err);
        // Even if session destruction fails, try to clear the cookie
         // Still proceed to clear cookie and send response
      } else {
       console.log('Session destroyed successfully.');
      }

      // Clear the session cookie from the client
      // Use the same cookie name and options as configured in session settings
      const cookieName = 'connect.sid'; // Default name
      res.clearCookie(cookieName, sessionSettings.cookie);
      res.sendStatus(200);
    });

    // Optional: Invalidate Supabase session on the client-side
    // The client calling this /api/logout endpoint should also call supabase.auth.signOut()
    // using the Supabase JS SDK to clear tokens in localStorage etc.
    // Server-side Supabase session invalidation is complex without the token,
    // which isn't stored in the basic session object here. Rely on client-side SDK logout.
    // Alternatively, if you stored the supabase session in your express session,
    // you could try invalidating it here, but it's less straightforward.
  });

  // Get current user endpoint
  // This endpoint relies solely on the server-side session to check if a user is logged in,
  // and then fetches the latest user data from the database.
  app.get("/api/user", async (req, res) => {
    if (!req.session?.user) { // Use optional chaining for safety
       console.log('Get user attempt: No session user found, sending 401.');
      return res.sendStatus(401); // Not authenticated
    }

     console.log('Get user attempt: Session user found:', req.session.user);

    // Fetch full user details from database using the ID from the session.
    // This ensures the most up-to-date user data (like role, isActive status etc.) is sent.
    // Convert the session ID string back to a number for the storage method.
    const userIdString = req.session.user.id;
    const userId = Number(userIdString);

    if (isNaN(userId)) {
        console.error('Invalid user ID in session (not a number):', userIdString);
         // Invalid session data, destroy it
        req.session.destroy((err) => {
             if (err) console.error('Error destroying session for invalid ID:', err);
             res.sendStatus(401); // Treat as not authenticated
        });
        return;
    }

    try {
        // Call the correct method 'getUser' with the converted number ID
        const dbUser = await storage.getUser(userId);

        if (dbUser) {
            console.log('Fetched full user data from DB for session user ID:', dbUser.id);
            // Determine role based on roleId from DB
            const roleMap: { [key: number]: string } = { 1: 'admin', 2: 'hotel', 3: 'agent', 4: 'user' };
            const userRole = roleMap[dbUser.roleId] || 'user';

            // Return relevant user data from the database
            res.json({
                 id: dbUser.id,
                 email: dbUser.email,
                 username: dbUser.username,
                 fullName: dbUser.fullName,
                 role: userRole,
                 isActive: dbUser.isActive, // Include relevant fields from your DB schema
                 isEmailVerified: dbUser.isEmailVerified,
                 // Add other fields from your User type except sensitive ones (password, authUserId etc.)
            });
        } else {
             console.warn('Session user ID found in session, but user not found/active in database ID:', userId);
             // User exists in session but not DB or inactive? Invalid session. Destroy it.
             req.session.destroy((err) => {
                 if (err) console.error('Error destroying session for missing/inactive DB user:', err);
                 res.sendStatus(401); // User effectively not found/authenticated
             });
        }
    } catch (error) {
         console.error('Error fetching user from database based on session ID:', error);
         // In case of database error, treat as authentication failure
         req.session.destroy((err) => {
              if (err) console.error('Error destroying session after DB lookup failure:', err);
              res.status(500).json({ error: 'Failed to retrieve user data' });
         });
    }
  });


  // Optional: Middleware examples (kept for reference)
  // function requireAuth(req: any, res: any, next: any) { /* ... */ }
  // function requireRole(requiredRole: string | string[]) { /* ... */ }
}

export { supabaseAdmin, supabase };