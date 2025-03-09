'use client';

import { formatTimeRemaining, getTimeRemaining, isWithinAllowedTime } from '@/utils/timeUtils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

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
  
  // Use refs to track state between renders
  const hasInitializedRef = useRef(false);
  const lastStatusChangeTimeRef = useRef(0);
  const reloadScheduledRef = useRef(false);
  const lastStatusRef = useRef(false);
  
  useEffect(() => {
    // Initialize on mount only
    if (!hasInitializedRef.current) {
      const currentStatus = isWithinAllowedTime();
      setIsTimeAllowed(currentStatus);
      lastStatusRef.current = currentStatus;
      hasInitializedRef.current = true;
    }
    
    const updateTimer = () => {
      try {
        const { hours, minutes, seconds, isUntilSessionEnd: untilEnd } = getTimeRemaining();
        setTimeRemainingFormatted(formatTimeRemaining(hours, minutes, seconds));
        setIsUntilSessionEnd(untilEnd);
        
        // Check if status changed
        const currentStatus = isWithinAllowedTime();
        
        // Only take action if status genuinely changed from last check
        if (currentStatus !== lastStatusRef.current) {
          console.log(`Time status changed: ${lastStatusRef.current} -> ${currentStatus}`);
          
          // Update state
          setIsTimeAllowed(currentStatus);
          lastStatusRef.current = currentStatus;
          
          // Rate limit reloads (at most once every 10 seconds)
          const now = Date.now();
          if (!reloadScheduledRef.current && now - lastStatusChangeTimeRef.current > 10000) {
            reloadScheduledRef.current = true;
            lastStatusChangeTimeRef.current = now;
            
            // Schedule reload with delay to avoid race conditions
            console.log("Scheduling page reload in 2 seconds");
            setTimeout(() => {
              if (document.visibilityState === 'visible') {
                console.log("Executing scheduled reload");
                // Store a flag in sessionStorage to prevent infinite loops
                if (!sessionStorage.getItem('reloading')) {
                  sessionStorage.setItem('reloading', 'true');
                  window.location.reload();
                } else {
                  console.log("Prevented reload loop - page was recently reloaded");
                  // Clear the flag after a delay
                  setTimeout(() => {
                    sessionStorage.removeItem('reloading');
                  }, 5000);
                }
              } else {
                console.log("Skipping reload - page not visible");
              }
              reloadScheduledRef.current = false;
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error in time restriction timer:", error);
      }
    };
    
    // Update timer now and set interval
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    // Clear the reloading flag when the component mounts
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        sessionStorage.removeItem('reloading');
      }, 1000);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, []);  // Empty dependency array - run only on mount
  
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
