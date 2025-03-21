const MusicController = () => {
  return (
    <div className='grid w-full h-24 grid-cols-1 px-8 bg-white border-t border-neutral-200 md:grid-cols-3 dark:bg-neutral-700 dark:border-neutral-600'>
      <div className='items-center justify-center hidden me-auto md:flex'>
        <img
          className='h-10 me-3 rounded'
          src='https://static.vecteezy.com/system/resources/thumbnails/007/286/713/small/afro-girl-enjoying-music-wearing-sunglasses-and-headphone-banner-vector.jpg'
          alt='Video preview'
        />
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>Flowbite Crash Course</span>
      </div>
      <div className='flex items-center w-full'>
        <div className='w-full'>
          <div className='flex items-center justify-center mx-auto mb-1'>
            <button
              data-tooltip-target='tooltip-shuffle'
              type='button'
              className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
            >
              <svg
                className=' w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 18'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  stroke-width='2'
                  d='M11.484 6.166 13 4h6m0 0-3-3m3 3-3 3M1 14h5l1.577-2.253M1 4h5l7 10h6m0 0-3 3m3-3-3-3'
                />
              </svg>
              <span className='sr-only'>Shuffle video</span>
            </button>
            <div
              id='tooltip-shuffle'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
            >
              Shuffle video
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            <button
              data-tooltip-target='tooltip-previous'
              type='button'
              className='p-2.5 group rounded-full hover:bg-neutral-100 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
            >
              <svg
                className='rtl:rotate-180 w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 12 16'
              >
                <path d='M10.819.4a1.974 1.974 0 0 0-2.147.33l-6.5 5.773A2.014 2.014 0 0 0 2 6.7V1a1 1 0 0 0-2 0v14a1 1 0 1 0 2 0V9.3c.055.068.114.133.177.194l6.5 5.773a1.982 1.982 0 0 0 2.147.33A1.977 1.977 0 0 0 12 13.773V2.227A1.977 1.977 0 0 0 10.819.4Z' />
              </svg>
              <span className='sr-only'>Previous video</span>
            </button>
            <div
              id='tooltip-previous'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
            >
              Previous video
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            <button
              data-tooltip-target='tooltip-pause'
              type='button'
              className='inline-flex items-center justify-center p-2.5 mx-2 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-hidden dark:focus:ring-blue-800'
            >
              <svg
                className='w-3 h-3 text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 10 16'
              >
                <path
                  fill-rule='evenodd'
                  d='M0 .8C0 .358.32 0 .714 0h1.429c.394 0 .714.358.714.8v14.4c0 .442-.32.8-.714.8H.714a.678.678 0 0 1-.505-.234A.851.851 0 0 1 0 15.2V.8Zm7.143 0c0-.442.32-.8.714-.8h1.429c.19 0 .37.084.505.234.134.15.209.354.209.566v14.4c0 .442-.32.8-.714.8H7.857c-.394 0-.714-.358-.714-.8V.8Z'
                  clip-rule='evenodd'
                />
              </svg>
              <span className='sr-only'>Pause video</span>
            </button>
            <div
              id='tooltip-pause'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
            >
              Pause video
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            <button
              data-tooltip-target='tooltip-next'
              type='button'
              className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
            >
              <svg
                className='rtl:rotate-180 w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 12 16'
              >
                <path d='M11 0a1 1 0 0 0-1 1v5.7a2.028 2.028 0 0 0-.177-.194L3.33.732A2 2 0 0 0 0 2.227v11.546A1.977 1.977 0 0 0 1.181 15.6a1.982 1.982 0 0 0 2.147-.33l6.5-5.773A1.88 1.88 0 0 0 10 9.3V15a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1Z' />
              </svg>
              <span className='sr-only'>Next video</span>
            </button>
            <div
              id='tooltip-next'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
            >
              Next video
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            <button
              data-tooltip-target='tooltip-restart'
              type='button'
              className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
            >
              <svg
                className='w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 18 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  stroke-width='2'
                  d='M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97'
                />
              </svg>
              <span className='sr-only'>Restart video</span>
            </button>
            <div
              id='tooltip-restart'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
            >
              Restart video
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
          </div>
          <div className='flex items-center justify-between space-x-2 rtl:space-x-reverse'>
            <span className='text-sm font-medium text-neutral-500 dark:text-neutral-400'>3:45</span>
            <div className='w-full bg-neutral-200 rounded-full h-1.5 dark:bg-neutral-800'>
              <div className='bg-blue-600 h-1.5 rounded-full w-8'></div>
            </div>
            <span className='text-sm font-medium text-neutral-500 dark:text-neutral-400 w-7'>5:00</span>
          </div>
        </div>
      </div>
      <div className='items-center justify-center hidden ms-auto md:flex'>
        <button
          data-tooltip-target='tooltip-playlist'
          type='button'
          className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
        >
          <svg
            className='w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 16'
          >
            <path d='M14.316.051A1 1 0 0 0 13 1v8.473A4.49 4.49 0 0 0 11 9c-2.206 0-4 1.525-4 3.4s1.794 3.4 4 3.4 4-1.526 4-3.4a2.945 2.945 0 0 0-.067-.566c.041-.107.064-.22.067-.334V2.763A2.974 2.974 0 0 1 16 5a1 1 0 0 0 2 0C18 1.322 14.467.1 14.316.051ZM10 3H1a1 1 0 0 1 0-2h9a1 1 0 1 1 0 2Z' />
            <path d='M10 7H1a1 1 0 0 1 0-2h9a1 1 0 1 1 0 2Zm-5 4H1a1 1 0 0 1 0-2h4a1 1 0 1 1 0 2Z' />
          </svg>
          <span className='sr-only'>View playlist</span>
        </button>
        <div
          id='tooltip-playlist'
          role='tooltip'
          className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
        >
          View playlist
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
        {/* <button
          data-tooltip-target='tooltip-captions'
          type='button'
          className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'>
          <svg
            className='w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 16'>
            <path d='M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM7.648 9.636c.25 0 .498-.064.717-.186a1 1 0 1 1 .979 1.745 3.475 3.475 0 1 1 .185-5.955 1 1 0 1 1-1.082 1.681 1.475 1.475 0 1 0-.799 2.715Zm6.186 0c.252 0 .5-.063.72-.187a1 1 0 1 1 .974 1.746 3.475 3.475 0 1 1 .188-5.955 1 1 0 0 1-1.084 1.681 1.475 1.475 0 1 0-.8 2.715h.002Z' />
          </svg>
          <span className='sr-only'>Captions</span>
        </button> */}
        <div
          id='tooltip-captions'
          role='tooltip'
          className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
        >
          Toggle captions
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target='tooltip-expand'
          type='button'
          className='p-2.5 group rounded-full hover:bg-neutral-100 me-1 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
        >
          <svg
            className='w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 18'
          >
            <path d='M18 .989a1.016 1.016 0 0 0-.056-.277c-.011-.034-.009-.073-.023-.1a.786.786 0 0 0-.066-.1.979.979 0 0 0-.156-.224l-.007-.01a.873.873 0 0 0-.116-.073.985.985 0 0 0-.2-.128.959.959 0 0 0-.231-.047A.925.925 0 0 0 17 0h-4a1 1 0 1 0 0 2h1.664l-3.388 3.552a1 1 0 0 0 1.448 1.381L16 3.5V5a1 1 0 0 0 2 0V.989ZM17 12a1 1 0 0 0-1 1v1.586l-3.293-3.293a1 1 0 0 0-1.414 1.414L14.586 16H13a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM3.414 2H5a1 1 0 0 0 0-2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3.414l3.536 3.535A1 1 0 0 0 6.95 5.535L3.414 2Zm2.139 9.276L2 14.665V13a1 1 0 1 0-2 0v4c.006.046.015.09.027.135.006.08.022.16.048.235a.954.954 0 0 0 .128.2.95.95 0 0 0 .073.117l.01.007A.983.983 0 0 0 1 18h4a1 1 0 0 0 0-2H3.5l3.436-3.276a1 1 0 0 0-1.38-1.448h-.003Z' />
          </svg>
          <span className='sr-only'>Expand</span>
        </button>
        <div
          id='tooltip-expand'
          role='tooltip'
          className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
        >
          Full screen
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target='tooltip-volume'
          type='button'
          className='p-2.5 group rounded-full hover:bg-neutral-100 focus:outline-hidden focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 dark:hover:bg-neutral-600'
        >
          <svg
            className='w-4 h-4 text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 18'
          >
            <path d='M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm2.728 4.695a1.001 1.001 0 0 0-.29 1.385 4.887 4.887 0 0 1 0 5.126 1 1 0 0 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658 1 1 0 0 0-1.384-.29Zm4.441-2.904a1 1 0 0 0-1.664 1.11A10.429 10.429 0 0 1 18 9a10.465 10.465 0 0 1-1.614 5.675 1 1 0 1 0 1.674 1.095A12.325 12.325 0 0 0 20 9a12.457 12.457 0 0 0-1.995-6.852Z' />
          </svg>
          <span className='sr-only'>Adjust volume</span>
        </button>
        <div
          id='tooltip-volume'
          role='tooltip'
          className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-neutral-700'
        >
          Adjust volume
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
      </div>
    </div>
  );
};

export default MusicController;
