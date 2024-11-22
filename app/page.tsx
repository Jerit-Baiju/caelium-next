'use client';
import CustomSelect from '@/components/home/CustomSelect';
import Personal from '@/components/home/spaces/personal';
// import SpeedDial from '@/components/home/SpeedDial';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Wrapper from './Wrapper';

const spaceOptions = [
  { value: 'personal', label: 'Personal', icon: 'user' },
  { value: 'partner', label: 'Partner', icon: 'heart' },
  { value: 'family', label: 'Family', icon: 'people-group' },
  { value: 'work', label: 'Work', icon: 'building' },
];

type SpaceType = 'personal' | 'partner' | 'family' | 'work';

/**
 * Home component temporarily blocks the homepage and redirects to the '/chats' route.
 * It manages the selected space state and persists it in localStorage.
 * Depending on the selected space, it renders different content.
 * If the user is not authenticated, it shows a loader.
 */

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [selectedSpace, setSelectedSpace] = useState<SpaceType>(() => {
    const savedSpace = localStorage.getItem('selectedSpace');
    return (savedSpace as SpaceType) || 'personal';
  });

  const handleSelect = (value: SpaceType) => {
    console.log('Selected Version:', value);
    setSelectedSpace(value);
  };

  useEffect(() => {
    router.push('/chats');
  }, [router]);

  useEffect(() => {
    localStorage.setItem('selectedSpace', selectedSpace);
  }, [selectedSpace]);

  const renderContent = () => {
    switch (selectedSpace) {
      case 'personal':
        return <Personal />;
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

  return user ? (
    <Wrapper>
      <div className='w-full dark:text-white'>
        <div className='p-4'>
          <CustomSelect options={spaceOptions} onSelect={handleSelect} defaultOption={selectedSpace} />
        </div>
        {renderContent()}
      </div>
      {/* <SpeedDial /> */}
    </Wrapper>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Loader />
    </div>
  );
}
