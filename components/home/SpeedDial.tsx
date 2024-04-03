const SpeedDial = () => {
  return (
    <div data-dial-init className='fixed end-6 bottom-20 group sm:hidden'>
      <div id='speed-dial-menu-square' className='flex-col items-center hidden mb-4 space-y-2'>
        <button
          type='button'
          data-tooltip-target='tooltip-download'
          data-tooltip-placement='left'
          className='flex justify-center items-center w-[52px] h-[52px] text-neutral-500 hover:text-neutral-900 bg-white rounded-lg border border-neutral-200 dark:border-neutral-600 shadow-sm dark:hover:text-white dark:text-neutral-400 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 focus:ring-4 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-400'
        >
          <i className='fa-solid fa-download'></i>
          <span className='sr-only'>Download</span>
        </button>
        <div
          id='tooltip-download'
          role='tooltip'
          className='absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-neutral-700'
        >
          Download
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
        <button
          type='button'
          data-tooltip-target='tooltip-copy'
          data-tooltip-placement='left'
          className='flex justify-center items-center w-[52px] h-[52px] text-neutral-500 hover:text-neutral-900 bg-white rounded-lg border border-neutral-200 dark:border-neutral-600 dark:hover:text-white shadow-sm dark:text-neutral-400 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 focus:ring-4 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-400'
        >
          <i className='fa-solid fa-copy'></i>
          <span className='sr-only'>Copy</span>
        </button>
        <div
          id='tooltip-copy'
          role='tooltip'
          className='absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-neutral-700'
        >
          Copy
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
      </div>
      <button
        type='button'
        data-dial-toggle='speed-dial-menu-square'
        aria-controls='speed-dial-menu-square'
        aria-expanded='false'
        className='flex items-center justify-center text-white bg-neutral-700 rounded-lg w-14 h-14 hover:bg-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-300 focus:outline-none dark:focus:ring-neutral-800'
      >
        <i className='fa-solid fa-plus'></i>
        <span className='sr-only'>Open actions menu</span>
      </button>
    </div>
  );
};

export default SpeedDial;
