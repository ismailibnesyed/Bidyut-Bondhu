const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-100 px-5 py-10">
      <div className="max-w-5xl mx-auto bg-base-200 rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
          <p className="mt-3 text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-base-content">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-2">
              PowerCare respects your privacy and is committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, and protect your information while using our Load Shedding &
              Power Outage Management System.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Name, username, and email address</li>
              <li>Phone number and postal code</li>
              <li>Reported power outage information</li>
              <li>Account and system activity data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>To provide load shedding information</li>
              <li>To manage outage complaints</li>
              <li>To assign and track technician activities</li>
              <li>To improve system performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Data Security</h2>
            <p className="mt-2">
              We take reasonable security measures to protect your personal
              information from unauthorized access, modification, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. User Responsibilities</h2>
            <p className="mt-2">
              Users should provide accurate information and keep their account
              credentials confidential. Users are responsible for all activities
              performed through their account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Third Party Services</h2>
            <p className="mt-2">
              We do not sell or share personal information with third parties
              except when required for system operation or legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Changes to Privacy Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this Privacy Policy, contact us:
              <br />
              Email: support@powercare.com
              <br />
              Phone: +880 1XXX-XXXXXX
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;