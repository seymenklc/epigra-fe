import React from 'react'

export const useTimer = () => {
   const [time, setTime] = React.useState(0);
   const [isTimerActive, setIsTimerActive] = React.useState(false);

   const handleStartTimer = () => {
      setIsTimerActive(true);
   };

   const handleStopTimer = () => {
      if (!time && !isTimerActive) {
         return
      };
      setIsTimerActive(false);
   };

   const handleResetTimer = () => {
      setTime(0);
      setIsTimerActive(false);
   };

   React.useEffect(() => {
      let interval: NodeJS.Timeout | null = null;

      if (isTimerActive) {
         interval = setInterval(() => {
            setTime(prev => prev + 1);
         }, 1000);
      } else if (!isTimerActive && time !== 0) {
         clearInterval(interval as unknown as NodeJS.Timeout);
      }

      return () => {
         if (interval) clearInterval(interval);
      };
   }, [isTimerActive, time]);

   return {
      time,
      isTimerActive,
      handleStartTimer,
      handleStopTimer,
      handleResetTimer,
   };
}