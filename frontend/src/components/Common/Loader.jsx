import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="ld-ripple">
        <div />
        <div />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .ld-ripple {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .ld-ripple div {
    position: absolute;
    border: 1px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: ld-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  .ld-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }

  @keyframes ld-ripple {
    0% {
      top: 9px;
      left: 9px;
      width: 0;
      height: 0;
      opacity: 0;
    }

    4.9% {
      top: 9px;
      left: 9px;
      width: 0;
      height: 0;
      opacity: 0;
    }

    5% {
      top: 9px;
      left: 9px;
      width: 0;
      height: 0;
      opacity: 1;
    }

    100% {
      top: 0px;
      left: 0px;
      width: 18px;
      height: 18px;
      opacity: 0;
    }
  }`;

export default Loader;
