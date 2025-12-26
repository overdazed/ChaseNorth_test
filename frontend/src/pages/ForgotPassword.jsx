import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, { email });
            
            setMessage('If an account with that email exists, you will receive a password reset link.');
            // Optionally redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error requesting password reset:', err);
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ForgotPasswordContainer>
            <FormContainer>
                <form onSubmit={handleSubmit} className="form">
                    <h2>Reset Your Password</h2>
                    <p className="description">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <button type="submit" className="button-submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="back-to-login">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </form>
            </FormContainer>
        </ForgotPasswordContainer>
    );
};

const ForgotPasswordContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 450px;
    padding: 2.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .dark & {
        background: #2d2d2d;
        color: #f5f5f5;
    }

    h2 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        text-align: center;
        color: #000;
        
        .dark & {
            color: #f5f5f5;
        }
    }

    .description {
        color: #6b7280;
        margin-bottom: 2rem;
        text-align: center;
        font-size: 0.9375rem;
        
        .dark & {
            color: #d1d5db;
        }
    }

    .input-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
        
        .dark & {
            color: #e5e7eb;
        }
    }

    .input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.9375rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        
        &:focus {
            outline: none;
            border-color: #000;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
        
        .dark & {
            background-color: #3d3d3d;
            border-color: #4b5563;
            color: #f3f4f6;
            
            &::placeholder {
                color: #9ca3af;
            }
            
            &:focus {
                border-color: #9ca3af;
                box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.2);
            }
        }
    }

    .error-message {
        color: #dc2626;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #fef2f2;
        border-radius: 0.25rem;
        
        .dark & {
            background-color: #450a0a;
            color: #fca5a5;
        }
    }

    .success-message {
        color: #166534;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #f0fdf4;
        border-radius: 0.25rem;
        
        .dark & {
            background-color: #052e16;
            color: #86efac;
        }
    }

    .button-submit {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background-color: #000;
        color: white;
        font-weight: 500;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s, transform 0.1s;
        margin-top: 1rem;

        &:hover {
            background-color: #333;
        }

        &:active {
            transform: scale(0.98);
        }

        &:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
        
        .dark & {
            background-color: #f3f4f6;
            color: #111827;
            
            &:hover {
                background-color: #e5e7eb;
            }
            
            &:disabled {
                background-color: #4b5563;
                color: #9ca3af;
            }
        }
    }

    .back-to-login {
        text-align: center;
        margin-top: 1.5rem;
        
        a {
            color: #4f46e5;
            text-decoration: none;
            font-size: 0.9375rem;
            transition: color 0.2s;
            
            &:hover {
                color: #4338ca;
                text-decoration: underline;
            }
            
            .dark & {
                color: #818cf8;
                
                &:hover {
                    color: #a5b4fc;
                }
            }
        }
    }
`;

export default ForgotPassword;
