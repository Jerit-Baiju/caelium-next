// Variables for customization
const COMMUNITY_NAME = 'Community_Name'; // e.g., 'Marian College'
const COMMUNITY_EMAIL_DOMAIN = '@community.edu'; // e.g., '@marian.edu.in'
const COMMUNITY_PRIVATE_SPACE = "the community's private space"; // e.g., "Marian College's private space"

const InvitePage = () => {
  return (
    <main className='flex grow mt-12 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      <div className='w-full max-w-3xl mx-auto px-4 py-8'>
        {/* Welcome Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4'>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>
          <h1 className='text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
            You&apos;re Invited to {COMMUNITY_NAME} 🎉
          </h1>
          <p className='text-lg text-neutral-600 dark:text-neutral-400'>
            Someone from {COMMUNITY_NAME} wants you to join the conversation
          </p>
          <button className='bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg my-4 w-full max-w-md'>
            Login with your Organization Email
          </button>
        </div>

        {/* Verification Explanation */}
        <div className='bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 my-8 border border-green-200 dark:border-green-700'>
          <div className='flex items-start space-x-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>Why we need your organization email</h3>
              <p className='text-neutral-600 dark:text-neutral-300 text-sm mb-3'>
                We keep your {COMMUNITY_NAME} community safe and exclusive by verifying you&apos;re a real member. Only verified emails
                like <span className='font-mono bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded text-xs'>{COMMUNITY_EMAIL_DOMAIN}</span> can
                access {COMMUNITY_PRIVATE_SPACE}.
              </p>
              <div className='flex items-center text-xs text-neutral-700 dark:text-neutral-300'>
                <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
                No outsiders, no spam, just your mates
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvitePage;
