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
      options.find(opt => opt.value === selectedValue)?.label : '';

  return (
      <StyledWrapper ref={selectRef}>
        <div className={`select ${isOpen ? 'open' : ''}`}>
          <div
              className="selected"
              onClick={() => setIsOpen(!isOpen)}
              data-value={selectedValue}
          >
            <span className={!selectedValue ? 'text-gray-400 dark:text-gray-400' : ''}>
              {selectedValue ? displayText : placeholder}
            </span>
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
  /* Light mode (default) */
  --select-bg: rgb(250 250 250);
  --select-border: rgb(209 213 219);
  --select-text: rgb(17 24 39);
  --select-hover-bg: rgb(243 244 246);
  --select-selected-bg: rgb(239 246 255);
  --select-selected-text: rgb(29 78 216);
  --select-arrow: rgb(17 24 39);
  --select-focus-ring: 0 0 0 2px rgba(59, 130, 246, 0.25);
  --select-focus-border: rgb(59 130 246);
  --options-bg: rgb(250 250 250);
  --options-border: rgb(209 213 219);
  --option-hover-bg: rgb(243 244 246);
  --option-selected-bg: rgb(30 58 138);
  --option-selected-text: rgb(191 219 254);

  /* Dark mode overrides */
  .dark & {
    --select-bg: rgb(64 64 64);
    --select-border: rgb(82 82 82);
    --select-text: rgb(250 250 250);
    --select-hover-bg: rgb(75 85 99);
    --select-selected-bg: rgb(30 58 138);
    --select-selected-text: rgb(163 163 163);
    --select-arrow: rgb(163 163 163);
    --options-bg: rgb(64 64 64);
    --options-border: rgb(82 82 82);
    --option-hover-bg: rgb(75 85 99);
  }

  .select {
    width: 100%;
    cursor: pointer;
    position: relative;
    font-size: 0.875rem; /* text-sm */
  }

  .selected {
    background-color: var(--select-bg);
    border: 1px solid var(--select-border);
    color: var(--select-text);
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.625rem 1rem; /* p-2.5 */
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 42px; /* Match input height */
    transition: all 0.2s ease-in-out;
  }

  .select:focus-within .selected {
    border-color: var(--select-focus-border);
    box-shadow: var(--select-focus-ring);
  }

  .arrow {
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
    flex-shrink: 0;
    transition: transform 0.2s;
    fill: var(--select-arrow);
  }

  .select.open .arrow {
    transform: rotate(180deg);
  }

  .options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--options-bg);
    border: 1px solid var(--options-border);
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
    color: var(--select-text);
  }

  .option:hover {
    background-color: var(--option-hover-bg);
  }

  .option.selected {
    background-color: var(--option-selected-bg);
    color: var(--option-selected-text);
    font-weight: 600;
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`;

export default CustomSelect;
