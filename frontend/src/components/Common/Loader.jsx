import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="code-loader">
        <span>{'{'}</span><span>{'}'}</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .code-loader {
    color: #fff;
    font-family: Consolas, Menlo, Monaco, monospace;
    font-weight: bold;
    font-size: 100px;
    opacity: 0.8;
  }

  .code-loader span {
    display: inline-block;
    animation: pulse_414 0.4s alternate infinite ease-in-out;
  }

  .code-loader span:nth-child(odd) {
    animation-delay: 0.4s;
  }

  @keyframes pulse_414 {
    to {
      transform: scale(0.8);
      opacity: 0.1;
    }
  }`;

export default Loader;
