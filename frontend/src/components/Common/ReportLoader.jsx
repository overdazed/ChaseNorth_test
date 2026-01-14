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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

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
      opacity: 0.5;
    }
  }`;

export default Loader;