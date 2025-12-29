// src/components/Common/DeleteConfirmationModal.jsx
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { tw } from '../../utils/tailwind';
import xMarkIcon from '../../assets/x-mark.svg';

const BaseButton = styled.button`
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9375rem;
`;

const DeleteButton = styled(BaseButton).attrs({
  className: tw`bg-accent text-white hover:bg-opacity-90`
})``;

const CancelButton = styled(BaseButton)`
  background-color: #e0e0e0;
  color: #333;
  
  &:hover {
    background-color: #c7c7c7;
  }
`;

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
                        {title || 'Delete Review?'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="group ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
                        aria-label="Close modal"
                    >
                        <img
                            src={xMarkIcon}
                            alt=""
                            className="h-4 w-4"
                            style={{ filter: 'invert(50%)' }}
                        />
                        <span className="sr-only">Close modal</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <p className="mb-2 block text-sm font-medium text-neutral-900 dark:text-white">
                        {message || 'Are you sure you want to delete this review? This action cannot be undone.'}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
                </ModalFooter>
            </ModalContent>
        </div>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
  padding: 1rem;
`;

// Helper function to check if it's daytime (between 6 AM and 6 PM)
const isDaytime = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18; // 6 AM to 6 PM
};

const ModalContent = styled.div`
  background: ${isDaytime() ? '#fafafa' : '#1f2937'};
  @media (prefers-color-scheme: dark) {
    background: #1f2937;
    color: white;
  }
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  margin: 0 auto;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${isDaytime() ? '#1a1a1a' : 'white'};
  font-weight: 500;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  
  @media (prefers-color-scheme: dark) {
    border-bottom-color: #374151;
  }
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: inherit;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  flex-grow: 1;
  
  p {
    margin: 0;
    line-height: 1.5;
    color: inherit;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  margin: 0 1rem;
  border-top: 1px solid #e2e8f0;
  
  @media (prefers-color-scheme: dark) {
    border-top-color: #374151;
  }
`;


export default DeleteConfirmationModal;