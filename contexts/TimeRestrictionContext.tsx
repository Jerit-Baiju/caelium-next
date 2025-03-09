'use client';

import { formatTimeRemaining, getTimeRemaining, isWithinAllowedTime } from '@/utils/timeUtils';
import { createContext, useContext, useEffect, useState } from 'react';

interface TimeRestrictionContextType {
  isTimeAllowed: boolean;
  timeRemainingFormatted: string;
  isUntilSessionEnd: boolean;
}

const TimeRestrictionContext = createContext<TimeRestrictionContextType>({
  isTimeAllowed: false,
  timeRemainingFormatted: '00:00',
  isUntilSessionEnd: false
});

export const useTimeRestriction = () => useContext(TimeRestrictionContext);

export const TimeRestrictionProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [isTimeAllowed, setIsTimeAllowed] = useState<boolean>(false);
  const [timeRemainingFormatted, setTimeRemainingFormatted] = useState<string>('00:00');
  const [isUntilSessionEnd, setIsUntilSessionEnd] = useState<boolean>(false);
  
  useEffect(() => {
    // Check initial state
    const allowed = isWithinAllowedTime();
    setIsTimeAllowed(allowed);
    
    // Update timer
    const updateTimer = () => {
      const { hours, minutes, seconds, isUntilSessionEnd: untilEnd } = getTimeRemaining();
      setTimeRemainingFormatted(formatTimeRemaining(hours, minutes, seconds));
      setIsUntilSessionEnd(untilEnd);
      
      // Also check if time allowed status has changed
      const currentAllowed = isWithinAllowedTime();
      if (currentAllowed !== isTimeAllowed) {
        setIsTimeAllowed(currentAllowed);
        // If status changed, you might want to reload or take some action
        if (currentAllowed) {
          // Session just started - reload the page to show available content
          window.location.reload();
        } else {
          // Session just ended - reload to show unavailable message
          window.location.reload();
        }
      }
    };
    
    // Update immediately then set interval
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [isTimeAllowed]);
  
  return (
    <TimeRestrictionContext.Provider value={{ 
      isTimeAllowed, 
      timeRemainingFormatted, 
      isUntilSessionEnd 
    }}>
      {children}
    </TimeRestrictionContext.Provider>
  );
};
