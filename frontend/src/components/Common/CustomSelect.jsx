import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const CustomSelect = ({ options = [], value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  const displayText = selectedValue ?
      options.find(opt => opt.value === selectedValue)?.label : placeholder;

  return (
      <StyledWrapper ref={selectRef}>
        <div className={`select ${isOpen ? 'open' : ''}`}>
          <div
              className="selected"
              onClick={() => setIsOpen(!isOpen)}
              data-value={selectedValue}
          >
            <span>{displayText}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="arrow"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>
          {isOpen && (
              <div className="options">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`option ${selectedValue === option.value ? 'selected' : ''}`}
                        onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </div>
                ))}
              </div>
          )}
        </div>
      </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .select {
    width: 100%;
    cursor: pointer;
    position: relative;
    font-size: 0.875rem; /* text-sm */
  }

  /* Day Mode Styles */
  .selected {
    background-color: rgb(250 250 250); /* bg-neutral-50 */
    border: 1px solid rgb(209 213 219); /* border-gray-300 */
    color: rgb(17 24 39); /* text-gray-900 */
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.625rem 1rem; /* p-2.5 */
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 42px; /* Match input height */
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  }

  .select:focus-within .selected {
    border-color: rgb(59 130 246); /* focus:border-primary-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25); /* focus:ring-primary-500 */
  }

  .arrow {
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
    flex-shrink: 0;
    transition: transform 0.2s;
    fill: rgb(17 24 39); /* text-gray-900 */
  }

  .select.open .arrow {
    transform: rotate(180deg);
  }

  .options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgb(250 250 250); /* bg-neutral-50 */
    border: 1px solid rgb(209 213 219); /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    margin-top: 0.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    max-height: 15rem;
    overflow-y: auto;
    display: none;
  }

  .select.open .options {
    display: block;
  }

  .option {
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    color: rgb(17 24 39); /* text-gray-900 */
  }

  .option:hover {
    background-color: rgb(243 244 246); /* hover:bg-gray-100 */
  }

  .option.selected {
    background-color: rgb(239 246 255); /* bg-blue-50 */
    color: rgb(29 78 216); /* text-blue-700 */
    font-weight: 600;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  /* Dark Mode Styles */
  .dark .select .selected {
    background-color: rgb(55 65 81); /* dark:bg-gray-700 */
    border-color: rgb(75 85 99); /* dark:border-gray-600 */
    color: rgb(255 255 255); /* dark:text-white */
  }

  .dark .select .options {
    background-color: rgb(55 65 81); /* dark:bg-gray-700 */
    border-color: rgb(75 85 99); /* dark:border-gray-600 */
  }

  .dark .select .option {
    color: rgb(255 255 255); /* dark:text-white */
  }

  .dark .select .option:hover {
    background-color: rgb(75 85 99); /* dark:hover:bg-gray-600 */
  }

  .dark .select .option.selected {
    background-color: rgb(30 58 138); /* dark:bg-blue-900 */
    color: rgb(191 219 254); /* dark:text-blue-100 */
  }

  .dark .select .arrow {
    fill: rgb(250 250 250); /* text-neutral-50 */
  }
`;

export default CustomSelect;
