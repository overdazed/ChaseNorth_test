import React from 'react';
import styled from 'styled-components';

const AvailableForNewProjectButton = () => {
  return (
    <StyledWrapper>
      <button className="available-for-btn">
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        Available for new project
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .available-for-btn {
    --animation: 2s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 2px;
    color: #178d00;
    background-color: #e1f9dc;
    border-radius: 100px;
    padding: 1rem 1.5rem 1rem 0.5rem;
    outline: none;
    border: none;
    font-weight: 600;
    position: relative;
    transition: 0.2s ease-in-out;
    cursor: pointer;
  }
  .available-for-btn:hover {
    background-color: #ffffff;
  }
  .available-for-btn:active {
    background-color: #e1f9dc;
    border: solid 2px #178d00;
  }
  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 16px;
    height: 16px;
    border: solid 2px #178d00;
    border-radius: 50%;
    margin: 0 10px;
    background-color: transparent;
    animation: circle-keys var(--animation);
  }

  .circle .dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #178d00;
    animation: dot-keys var(--animation);
  }

  .circle .outline {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    animation: outline-keys var(--animation);
  }
  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }
  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }
  .circle:nth-child(1) .outline {
    animation-delay: 0.9s;
  }
  .circle:nth-child(2) .outline {
    animation-delay: 1.2s;
  }
  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 20px var(--color);
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }`;

export default AvailableForNewProjectButton;