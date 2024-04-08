import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
  icon: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultOption?: string;
  onSelect: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, defaultOption, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(defaultOption || null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const filteredOptions = options.filter((option) => option.value !== selectedOption);

  return (
    <div className='relative w-32' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-neutral-300 dark:bg-neutral-800 dark:text-white font-semibold py-2 px-4 rounded inline-flex items-center w-full'
      >
        {selectedOption ? (
          <>
            <i className={`fa-solid fa-${options.find((option) => option.value === selectedOption)?.icon}`}></i>
            <span className='ml-2'>{options.find((option) => option.value === selectedOption)?.label}</span>
          </>
        ) : (
          defaultOption
        )}
        <i className='fa-solid fa-chevron-down px-2 text-xs'></i>
      </button>
      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-full z-10'>
          <ul className='bg-neutral-200 dark:bg-neutral-800 dark:text-white rounded shadow-md'>
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className='cursor-pointer py-2 px-4 hover:bg-neutral-700'
              >
                <i className={`fa-solid fa-${option.icon} mr-2`}></i>
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
