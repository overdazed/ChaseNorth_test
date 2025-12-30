import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateWishlistCount } from '../../redux/slices/productsSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeartIcon = ({
                     className = '',
                     color = '#0a0a0a',
                     hoverColor = '#000000',
                     productId,
                     containerClass = '',
                     noAnimation = false,
                     onClick,
                     style
                   }) => {
// const HeartIcon = ({ className, color = '#374151', productId, containerClass = '' }) => {
  const [isActive, setIsActive] = useState(false);

  // Load saved state from localStorage on mount and sync with Redux
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      const wishlist = saved ? JSON.parse(saved) : [];
      setIsActive(wishlist.includes(productId));
      
      // Update Redux store with current wishlist count
      dispatch(updateWishlistCount(wishlist.length));
    }
  }, [productId, dispatch]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is not logged in
    if (!user) {
      // Store the product ID in local storage for after login
      const pendingWishlist = JSON.parse(localStorage.getItem('pendingWishlist') || '[]');
      if (!pendingWishlist.includes(productId)) {
        pendingWishlist.push(productId);
        localStorage.setItem('pendingWishlist', JSON.stringify(pendingWishlist));
      }
      // Redirect to login page with a return URL
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const newActiveState = !isActive;
    setIsActive(newActiveState);

    // Update localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      let wishlist = saved ? JSON.parse(saved) : [];
      let updatedWishlist;

      if (newActiveState) {
        // Add to wishlist if not already present
        updatedWishlist = [...new Set([...wishlist, productId])];
      } else {
        // Remove from wishlist
        updatedWishlist = wishlist.filter(id => id !== productId);
      }

      // Update localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Update Redux store with new wishlist count
      dispatch(updateWishlistCount(updatedWishlist.length));
    }
  };
  const handleIconClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!noAnimation) {
      handleClick(e);
    }
  };

  return (
      <StyledWrapper
          className={`heart-container ${className} ${containerClass} ${noAnimation ? 'no-animation' : ''}`}
          $color={color}
          $hoverColor={typeof hoverColor === 'string' ? hoverColor : undefined}
          style={{
            margin: '0',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style
          }}
          onClick={handleIconClick}
      >
        <input
            type="checkbox"
            className="checkbox"
            checked={isActive}
            onChange={handleClick}
        />
        <div className="svg-container" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 25 25" className="svg-outline" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
          </svg>
          <svg viewBox="0 0 25 25" className="svg-filled" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
          </svg>
          <svg className="svg-celebrate" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        </div>
      </StyledWrapper>
  );
};

const StyledWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$color', '$hoverColor'].includes(prop),
})`
  --heart-color: ${props => props.$color};
  --hover-color: ${props => props.$hoverColor};
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  .checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 20;
    cursor: pointer;
    pointer-events: none; /* Prevent direct interaction with the checkbox */
  }

  .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svg-outline,
  .svg-filled {
    position: relative;
    width: 18px;
    height: 18px;
    fill: var(--heart-color);
    transition: fill 0.2s ease;
  }
  
  &:hover {
    .svg-outline {
      fill: var(--hover-color);
    }
  }

  .svg-filled {
    display: none;
    animation: keyframes-svg-filled 0.5s;
  }

  .svg-celebrate {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    display: none;
    stroke: #571100;
    fill: #571100;
    stroke-width: 2px;
    pointer-events: none;
  }

  .checkbox:checked ~ .svg-container .svg-outline {
    display: none;
  }

  .checkbox:checked ~ .svg-container .svg-filled {
    display: block;
    // fill: #ff5b89; /* Matches the Topbar's background color */
    fill: #571100; /* Matches the Topbar's background color */
  }

  .checkbox:checked ~ .svg-container .svg-celebrate {
    display: block;
    animation: keyframes-svg-celebrate 0.5s;
    animation-fill-mode: forwards;
  }

  @keyframes keyframes-svg-filled {
    0% { transform: scale(0); }
    25% { transform: scale(1.2); }
    50% { transform: scale(1); filter: brightness(1.5); }
  }

  @keyframes keyframes-svg-celebrate {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { opacity: 1; filter: brightness(1.5); }
    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
  }
`;

export default HeartIcon;
