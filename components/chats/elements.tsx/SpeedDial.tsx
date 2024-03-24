const SpeedDial = () => {
  return (
    <div data-dial-init className='fixed end-6 bottom-20 group sm:hidden'>
      <div id='speed-dial-menu-square' className='flex-col items-center hidden mb-4 space-y-2'>
        <button
          type='button'
          data-tooltip-target='tooltip-download'
          data-tooltip-placement='left'
          className='flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400'>
          <span className='material-symbols-outlined'>download</span>
          <span className='sr-only'>Download</span>
        </button>
        <div
          id='tooltip-download'
          role='tooltip'
          className='absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'>
          Download
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
        <button
          type='button'
          data-tooltip-target='tooltip-copy'
          data-tooltip-placement='left'
          className='flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400'>
          <span className='material-symbols-outlined'>content_copy</span>
          <span className='sr-only'>Copy</span>
        </button>
        <div
          id='tooltip-copy'
          role='tooltip'
          className='absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'>
          Copy
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
      </div>
      <button
        type='button'
        data-dial-toggle='speed-dial-menu-square'
        aria-controls='speed-dial-menu-square'
        aria-expanded='false'
        className='flex items-center justify-center text-white bg-blue-700 rounded-lg w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800'>
        <span className='material-symbols-outlined'>add</span>
        <span className='sr-only'>Open actions menu</span>
      </button>
    </div>
  );
};

export default SpeedDial;
