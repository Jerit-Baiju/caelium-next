'use client';
import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

const page = () => {
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
  }, []);
  return (
    <div className='bg-gradient-to-r from-blue-50 to-gray-200 text-gray-800 min-h-screen p-8'>
      <div className='flex justify-center mb-8'>
        <img src='logos/written-dark.png' alt='Caelium Logo' className='w-48' />
      </div>
      <div className='max-w-4xl mx-auto bg-white/90 rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Terms and Conditions</h1>
        <p className='text-gray-600 mb-6'>
          Welcome to Caelium! By using our app, you agree to comply with the following terms and conditions. These terms are governed
          by Indian laws, and any disputes will be handled in accordance with the applicable laws of India.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>1. User Responsibilities</h2>
        <p className='text-gray-600'>By using Caelium, you agree to:</p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Provide accurate and truthful information during registration.</li>
          <li>Maintain the confidentiality of your login credentials.</li>
          <li>Use the app for lawful purposes only and refrain from activities that may harm others or the platform.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>2. Account Usage</h2>
        <p className='text-gray-600'>
          You are solely responsible for the activity on your account. We reserve the right to suspend or terminate accounts involved
          in:
        </p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Harassment, abuse, or harm to others.</li>
          <li>Posting illegal, inappropriate, or offensive content.</li>
          <li>Attempts to hack, exploit, or disrupt the app&apos;s functionality.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>3. Data Privacy</h2>
        <p className='text-gray-600'>
          Your data is handled as per our&nbsp;
          <a href='/privacy-policy' className='text-blue-500'>
            Privacy Policy
          </a>
          . By using the app, you consent to data collection and usage as outlined in the policy.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>4. Payment Terms</h2>
        <p className='text-gray-600'>
          All transactions made through the Razorpay payment gateway are subject to their terms of service. Ensure you understand the
          charges and refund policies before making any payments.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>5. Intellectual Property</h2>
        <p className='text-gray-600'>
          All content, designs, and functionalities of Caelium are the intellectual property of Caelium or its licensors. Unauthorized
          use, reproduction, or distribution of this content is strictly prohibited.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>6. Limitation of Liability</h2>
        <p className='text-gray-600'>
          Caelium will not be held liable for any direct, indirect, or incidental damages resulting from:
        </p>
        <ul className='list-disc list-inside space-y-2 text-gray-600'>
          <li>Errors or interruptions in the app’s services.</li>
          <li>Unauthorized access to user data.</li>
          <li>Actions or content shared by users within the platform.</li>
        </ul>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>7. Termination</h2>
        <p className='text-gray-600'>
          We reserve the right to suspend or terminate your access to Caelium at any time without prior notice if you violate these
          terms or engage in activities deemed harmful to the app or its users.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>8. Updates to Terms</h2>
        <p className='text-gray-600'>
          These terms may be updated periodically. Changes will take immediate effect upon publication on this page. Continued use of
          the app implies acceptance of the updated terms.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>9. Governing Law</h2>
        <p className='text-gray-600'>
          These terms are governed by the laws of India. Any disputes will be resolved under the jurisdiction of the courts in Kerala,
          India.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-4 mb-2'>10. Contact Us</h2>
        <p className='text-gray-600'>
          If you have any questions or concerns regarding these terms, please contact us at&nbsp;
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

export default page;
