import React from 'react';
import styled from 'styled-components';
import XMarkIcon from '../../assets/x-mark.svg';

const XMarkButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <img src={XMarkIcon} alt="X Mark" className="xmark" />
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: 60px;
    height: 60px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(250, 250, 250);
    border-radius: 50%;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.13);
    border: none;
  }

  .xmark {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
  }

  .button:hover {
    background-color: rgb(230, 230, 230);
  }

  .button:hover .xmark {
    animation: bellRing 0.9s both;
  }

  @keyframes bellRing {
    0%,
    100% {
      transform: rotateZ(0);
      transform-origin: center center;
    }
    15% {
      transform: rotateZ(10deg);
    }
    30% {
      transform: rotateZ(-10deg);
    }
    45% {
      transform: rotateZ(5deg);
    }
    60% {
      transform: rotateZ(-5deg);
    }
    75% {
      transform: rotateZ(2deg);
    }
  }

  .button:active {
    transform: scale(0.9);
  }
`;

export default XMarkButton;
