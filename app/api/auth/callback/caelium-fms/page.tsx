'use client';
import Loader from '@/components/layout/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useContext, useEffect } from 'react';

const page = () => {
  const { user, authTokens } = useContext(AuthContext);
  const { setShowNav } = useNavbar();
  // Hide navbar and sidebar on mount, restore on unmount
  useEffect(() => {
    setShowNav(false);
    return () => {
      setShowNav(true);
    };
  }, [setShowNav]);
  // Redirect to welcome page if user is not authenticated
  // and then redirect to FMS callback with token
  useEffect(() => {
    if (!user) {
      window.location.href = '/welcome?redirect=caelium-fms';
      return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_FMS_HOST}/api/auth/callback/caelium?access=${authTokens?.access || ''}&refresh=${authTokens?.refresh}`;
  }, [user]);
  return <Loader fullScreen />;
};

export default page;
