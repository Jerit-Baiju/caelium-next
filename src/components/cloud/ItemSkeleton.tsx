import React from 'react';

const ItemSkeleton = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4'>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className='animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
          <div className='aspect-square bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center'>
            <div className='bg-neutral-200 dark:bg-neutral-700 h-16 w-16 rounded'></div>
          </div>
          <div className='p-3'>
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2'></div>
            <div className='flex justify-between'>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3'></div>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemSkeleton;
