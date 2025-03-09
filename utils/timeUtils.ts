/**
 * Get session time configurations from environment variables with fallbacks
 */
const getSessionTimeConfig = () => {
  const startHour = parseInt(process.env.NEXT_PUBLIC_SESSION_START_HOUR || '10');
  const startMinute = parseInt(process.env.NEXT_PUBLIC_SESSION_START_MINUTE || '20');
  const endHour = parseInt(process.env.NEXT_PUBLIC_SESSION_END_HOUR || '10');
  const endMinute = parseInt(process.env.NEXT_PUBLIC_SESSION_END_MINUTE || '40');
  
  // Calculate minutes since midnight for comparison
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;
  
  // Format for display (e.g., "10:20 AM - 10:40 AM")
  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };
  
  const timeWindowDisplay = `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
  
  return {
    startHour,
    startMinute,
    endHour,
    endMinute,
    startTimeInMinutes,
    endTimeInMinutes,
    timeWindowDisplay
  };
};

/**
 * Checks if the current time is within the allowed time window
 * @returns boolean indicating whether the current time is within the allowed range
 */
export const isWithinAllowedTime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Convert current time to minutes since midnight for easier comparison
  const currentTimeInMinutes = hours * 60 + minutes;
  
  const { startTimeInMinutes, endTimeInMinutes } = getSessionTimeConfig();
  
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

/**
 * Gets the next available time window
 * @returns string with the next available time window
 */
export const getNextAvailableTime = (): string => {
  return getSessionTimeConfig().timeWindowDisplay;
};

/**
 * Gets the time remaining until the end of the current session or until the start of the next session
 * @returns object with the remaining time details
 */
export const getTimeRemaining = (): {
  timeRemaining: number;  // milliseconds
  hours: number;
  minutes: number;
  seconds: number;
  isUntilSessionEnd: boolean;
} => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const { startHour, startMinute, endHour, endMinute, startTimeInMinutes, endTimeInMinutes } = getSessionTimeConfig();
  
  let timeRemainingMs: number;
  let isUntilSessionEnd: boolean;
  
  if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
    // We're in the session, calculate time until end
    isUntilSessionEnd = true;
    
    // Calculate end time today
    const endTime = new Date(now);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    timeRemainingMs = endTime.getTime() - now.getTime();
  } else {
    // We're outside the session, calculate time until start
    isUntilSessionEnd = false;
    
    // Calculate next start time
    const startTime = new Date(now);
    if (currentTimeInMinutes >= endTimeInMinutes) {
      // If it's past the end time today, set for tomorrow
      startTime.setDate(startTime.getDate() + 1);
    }
    startTime.setHours(startHour, startMinute, 0, 0);
    
    timeRemainingMs = startTime.getTime() - now.getTime();
  }
  
  // Convert to hours, minutes and seconds for display
  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    timeRemaining: timeRemainingMs,
    hours,
    minutes,
    seconds,
    isUntilSessionEnd
  };
};

/**
 * Formats the time remaining in HH:MM:SS format
 */
export const formatTimeRemaining = (hours: number, minutes: number, seconds: number): string => {
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};
