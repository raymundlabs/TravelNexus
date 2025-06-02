import React from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Travel Agent";
      case 3:
        return "Hotel Owner";
      default:
        return "Customer";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Profile
          </h1>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : user ? (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 mb-2">
                  {user.fullName
                    ? user.fullName[0].toUpperCase()
                    : user.username[0].toUpperCase()}
                </div>
                <div className="text-xl font-semibold">
                  {user.fullName || user.username}
                </div>
                <div className="text-gray-500 text-sm">{user.email}</div>
                <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                  {getRoleName(user.roleId)}
                </span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-500 text-xs mb-1">Username</div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Role</div>
                  <div className="font-medium text-gray-900">
                    {getRoleName(user.roleId)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Full Name</div>
                  <div className="font-medium text-gray-900">
                    {user.fullName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Email</div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-red-500">
              No user data available.
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
