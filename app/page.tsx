'use client';
import CustomSelect from '@/components/home/CustomSelect';
import SpeedDial from '@/components/home/SpeedDial';
import { useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import Personal from '@/components/home/spaces/personal';

const spaceOptions = [
  { value: 'personal', label: 'Personal', icon: 'user' },
  { value: 'partner', label: 'Partner', icon: 'heart' },
  { value: 'family', label: 'Family', icon: 'people-group' },
  { value: 'work', label: 'Work', icon: 'building' },
];

type SpaceType = 'personal' | 'partner' | 'family' | 'work';

export default function Home() {
   const [selectedSpace, setSelectedSpace] = useState<SpaceType>(() => {
     const savedSpace = localStorage.getItem('selectedSpace');
     return (savedSpace as SpaceType) || 'personal';
   });

  const handleSelect = (value: SpaceType) => {
    console.log('Selected Version:', value);
    setSelectedSpace(value);
  };

  useEffect(() => {
    localStorage.setItem('selectedSpace', selectedSpace);
  }, [selectedSpace]);

  const renderContent = () => {
    switch (selectedSpace) {
      case 'personal':
        return <Personal/>
      case 'partner':
        return <div>Partner Content</div>;
      case 'family':
        return <div>Family Content</div>;
      case 'work':
        return <div>Work Content</div>;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <div className='w-full dark:text-white'>
        <div className='p-4'>
          <CustomSelect options={spaceOptions} onSelect={handleSelect} defaultOption={selectedSpace} />
        </div>
        {renderContent()}
      </div>
      <SpeedDial />
    </Wrapper>
  );
}
