import { useState, useEffect } from 'react';

const usePreviousDayChecker = (providedDate) => {
  const [isPreviousDay, setIsPreviousDay] = useState(false);

  useEffect(() => {
    const providedDate = new Date(providedDate);
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const previousDayDate = new Date(currentYear, currentMonth, currentDay - 1);

    setIsPreviousDay(
      providedDate.getDate() === previousDayDate.getDate() &&
        providedDate.getMonth() === previousDayDate.getMonth() &&
        providedDate.getFullYear() === previousDayDate.getFullYear(),
    );
  }, [providedDate]);

  return isPreviousDay;
};

export default usePreviousDayChecker;
