import React from 'react';
import styled from 'styled-components';

const BellButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <svg viewBox="0 0 24 24" className="bell" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>
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

  .bell {
    width: 24px;
    fill: #571100;
  }


  .button:hover {
    background-color: rgb(200, 200, 200);
  }

  .button:hover .bell {
    animation: bellRing 0.9s both;
  }

  @keyframes bellRing {
    0%,
    100% {
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
    transform: scale(0.8);
  }
`;

export default BellButton;
