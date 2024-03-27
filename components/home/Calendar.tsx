// components/Calendar.tsx

import { useState } from 'react';

interface CalendarProps {
  initialDate?: Date;
  onSelectDate: (date: Date) => void;
}

interface EventDate {
  year: number;
  month: number;
  day: number;
}

const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date(), onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const prevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonthDate = new Date(prevDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonthDate = new Date(prevDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'long' });
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDateCopy = new Date(currentDate);
    selectedDateCopy.setDate(day);
    setSelectedDate(selectedDateCopy);
    onSelectDate(selectedDateCopy);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Sample event dates (to be replaced with actual data from backend)
    const eventDates: EventDate[] = [
      { year: 2024, month: 3, day: 5 },
      { year: 2024, month: 3, day: 13 },
      { year: 2024, month: 4, day: 10 },
      { year: 2024, month: 5, day: 20 },
    ];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className='text-center'></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
      const isEventDay = eventDates.some(
        (event) => event.year === currentDate.getFullYear() && event.month === currentDate.getMonth() + 1 && event.day === day,
      );
      const isSelectedDay = selectedDate
        ? selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth()
        : false;
      const dayClasses = `text-center rounded-full ${isCurrentDay ? 'bg-blue-400 dark:bg-blue-600' : ''} ${
        isEventDay ? 'bg-neutral-200 dark:bg-neutral-600' : ''
      } ${isSelectedDay ? 'border border-black dark:border-white' : ''} cursor-pointer flex items-center justify-center w-10 h-10`;
      days.push(
        <div key={day} className={dayClasses} onClick={() => handleDateClick(day)}>
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className='bg-neutral-100 dark:bg-neutral-800 dark:text-white text-black p-4 m-4 h-max rounded-lg'>
      <div className='flex justify-between mb-4'>
        <button className='px-6 py-1' onClick={prevMonth}>
          <i className='fa-solid fa-chevron-left'></i>
        </button>
        <div className='font-extrabold mx-6'>
          {getMonthName(currentDate)} {getYear(currentDate)}
        </div>
        <button className='px-6 py-1' onClick={nextMonth}>
          <i className='fa-solid fa-chevron-right'></i>
        </button>
      </div>
      <div className='grid grid-cols-7 gap-2'>
        {weekdays.map((day, i) => (
          <div className='text-center' key={i}>
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
