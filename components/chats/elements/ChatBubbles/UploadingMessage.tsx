const UploadingMessage = () => {
  const formattedTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div className={`flex flex-row-reverse items-start gap-3 my-6 max-w-[85%] ml-auto`}>
      <div className='flex flex-col'>
        <div className='flex items-center gap-2 mb-1.5'>
          <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>You</span>
          <span className='text-[11px] text-neutral-500 dark:text-neutral-400'>{formattedTime}</span>
        </div>
        <div
          className={`
            rounded-2xl px-5 py-3 
            bg-white text-neutral-900 
            dark:bg-neutral-800 dark:text-white 
            border border-neutral-200 dark:border-neutral-700
            rounded-tr-none
            transition-colors duration-200
            hover:shadow-md
            max-w-prose break-words
          `}
        >
          <div className='flex items-center gap-2'>
            <span className='text-[15px] font-normal'>Uploading</span>
            <div className='flex space-x-1 animate-pulse'>
              <div className='h-2 w-2 bg-current rounded-full'></div>
              <div className='h-2 w-2 bg-current rounded-full animation-delay-150'></div>
              <div className='h-2 w-2 bg-current rounded-full animation-delay-300'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadingMessage;
