import React from 'react';
import { Link, useLocation } from 'wouter';

const TermsAndConditions: React.FC = () => {
  const [location] = useLocation();
  // Extract the referring path, defaulting to home if none found
  const backPath = document.referrer.includes('booking/') 
    ? document.referrer.substring(document.referrer.indexOf('/booking/')) 
    : '/';
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600">Last updated: June 4, 2025</p>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Booking and Payment</h2>
          <p className="mb-4">
            All bookings are subject to availability. A booking is only confirmed once full payment has been received and processed. 
            We accept major credit cards and bank transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Cancellation Policy</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Cancellations made 30+ days before departure: Full refund</li>
            <li>Cancellations made 15-29 days before departure: 50% refund</li>
            <li>Cancellations made 0-14 days before departure: No refund</li>
          </ul>
          <p>All cancellation requests must be made in writing.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Travel Documents</h2>
          <p className="mb-4">
            It is the traveler's responsibility to ensure they have valid travel documents, including passports, visas, and any required health certificates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Travel Insurance</h2>
          <p className="mb-4">
            We strongly recommend that all travelers obtain comprehensive travel insurance to cover cancellation, medical expenses, personal accident, and loss of personal belongings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Changes to Bookings</h2>
          <p className="mb-4">
            Changes to bookings are subject to availability and may incur additional charges. Please contact us as soon as possible if you need to make any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Special Requirements</h2>
          <p className="mb-4">
            Please inform us at the time of booking of any special requirements, including dietary restrictions or mobility issues, and we will do our best to accommodate your needs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
          <p className="mb-4">
            Our company is not liable for any loss, damage, injury, or expense resulting from any act, omission, or event beyond our control, including but not limited to war, terrorist activity, civil unrest, natural disaster, or adverse weather conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Privacy Policy</h2>
          <p className="mb-4">
            We are committed to protecting your privacy. Your personal information will be used solely for the purpose of processing your booking and will not be shared with third parties without your consent, except as required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company is registered.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <address className="not-italic">
            <p>TravelNexus Customer Service</p>
            <p>Email: support@travelnexus.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </address>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link href={backPath} className="text-primary hover:text-primary-dark font-medium">
          &larr; Back to Booking
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
