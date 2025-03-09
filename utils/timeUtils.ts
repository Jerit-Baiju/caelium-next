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
  
  // 10:20 AM = 10 hours and 20 minutes = 620 minutes since midnight
  const startTimeInMinutes = 10 * 60 + 20;
  
  // 10:40 AM = 10 hours and 40 minutes = 640 minutes since midnight
  const endTimeInMinutes = 10 * 60 + 40;
  
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

/**
 * Gets the next available time window
 * @returns string with the next available time window
 */
export const getNextAvailableTime = (): string => {
  return "10:20 AM - 10:40 AM";
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
  
  const startTimeInMinutes = 10 * 60 + 20; // 10:20 AM
  const endTimeInMinutes = 10 * 60 + 40;   // 10:40 AM
  
  let timeRemainingMs: number;
  let isUntilSessionEnd: boolean;
  
  if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
    // We're in the session, calculate time until end
    isUntilSessionEnd = true;
    
    // Calculate end time today
    const endTime = new Date(now);
    endTime.setHours(10, 40, 0, 0); // Set to 10:40:00.000
    
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
    startTime.setHours(10, 20, 0, 0); // Set to 10:20:00.000
    
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
