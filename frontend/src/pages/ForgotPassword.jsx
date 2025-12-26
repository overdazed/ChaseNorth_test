// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/slices/authSlice';
import styled from 'styled-components';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await dispatch(forgotPassword({ email })).unwrap();
            setMessage('If an account exists with this email, you will receive a password reset link.');
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <form onSubmit={handleSubmit} className="form">
                    <h2>Forgot Password</h2>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <p className="text-center">
                        Remember your password? <Link to="/login">Back to Login</Link>
                    </p>
                </form>
            </FormContainer>
        </Container>
    );
};

// Add styled components similar to your Login/Register pages
const Container = styled.div`
    display: flex;
    min-height: 90vh;
    width: 100%;
    background-color: #f8fafc;
    
    .dark & {
        background-color: #0a0a0a;
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 2rem;
    
    .form {
        width: 100%;
        max-width: 400px;
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        
        .dark & {
            background-color: #2d2d2d;
            color: #f5f5f5;
        }
    }
    
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        font-weight: 600;
    }
    
    .form-group {
        margin-bottom: 1rem;
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #4a5568;
            
            .dark & {
                color: #e2e8f0;
            }
        }
        
        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 1rem;
            
            .dark & {
                background-color: #3d3d3d;
                border-color: #4a5568;
                color: #f5f5f5;
            }
        }
    }
    
    .button-submit {
        width: 100%;
        padding: 0.75rem;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: #333333;
        }
        
        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    }
    
    .error-message {
        color: #e53e3e;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #fff5f5;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        
        .dark & {
            background-color: #2d1a1a;
        }
    }
    
    .success-message {
        color: #38a169;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #f0fff4;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        
        .dark & {
            background-color: #1a2e1f;
        }
    }
    
    .text-center {
        text-align: center;
        margin-top: 1rem;
        
        a {
            color: #3182ce;
            text-decoration: none;
            
            &:hover {
                text-decoration: underline;
            }
            
            .dark & {
                color: #90cdf4;
            }
        }
    }
`;

export default ForgotPassword;