'use client';
import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

const PrivacyPolicy = () => {
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
  }, []);
  return (
    <div className='bg-linear-to-r from-blue-50 to-gray-200 text-gray-800 min-h-screen p-8'>
      <div className='flex justify-center mb-8'>
        <img src='logos/written-dark.png' alt='Caelium Logo' className='w-48' />
      </div>
      <div className='max-w-4xl mx-auto bg-white/90 rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Privacy Policy</h1>
        <p className='text-gray-600 mb-6'>
          At Caelium, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your
          personal information. By using our app, you agree to the terms outlined in this policy.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>1. Information We Collect</h2>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Date joined, email address, and avatar (if available) from Google.</li>
          <li>Location, gender, and birthdate provided during registration.</li>
          <li>Last seen status on the app.</li>
          <li>Messages sent within the app (securely stored in our database).</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>2. How We Use Your Data</h2>
        <p className='text-gray-600'>We use the collected data to:</p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Provide and improve the app&apos;s functionality.</li>
          <li>Enhance your user experience within the app.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>3. Data Security</h2>
        <p className='text-gray-600'>
          Your data is securely stored using industry-standard security measures, including HTTPS protocols and a secure database.
          Messages are encrypted and cannot be accessed by developers, except for the super admin.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>4. Cookies</h2>
        <p className='text-gray-600'>
          We may use cookies with your permission to enhance your experience. Cookies are used for session management and analytics
          purposes.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>5. Third-Party Services</h2>
        <p className='text-gray-600'>We use the following third-party services:</p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Google Analytics for monitoring app performance.</li>
          <li>Microsoft Clarity for user behavior analysis.</li>
          <li>Razorpay for payment processing.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>6. Your Rights</h2>
        <p className='text-gray-600'>You have the right to:</p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>
            Request data deletion by emailing us at&nbsp;
            <a href='mailto:caelium@jerit.in' className='text-blue-500'>
              caelium@jerit.in
            </a>
            .
          </li>
          <li>Report issues or concerns directly to the developer at the same email address.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>7. Policy Updates</h2>
        <p className='text-gray-600'>
          We may update this Privacy Policy at any time with immediate effect. Changes will be reflected on this page and announced in
          our blog.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>8. No Data Sharing or Selling</h2>
        <p className='text-gray-600'>We do not sell your data to third parties or use it for marketing purposes.</p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>9. Contact Us</h2>
        <p className='text-gray-600'>
          If you have any questions or concerns about this Privacy Policy, please contact us at&nbsp;
          <a href='mailto:caelium@jerit.in' className='text-blue-500'>
            caelium@jerit.in
          </a>
          .
        </p>
        <p className='text-gray-500 text-sm mt-6'>Last updated on: 7th January, 2025</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
