import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/api/users/verify-reset-token`, {
                    params: { token }
                });
                setIsValidToken(true);
            } catch (err) {
                setError('Invalid or expired reset link. Please request a new one.');
            } finally {
                setIsTokenVerified(true);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setError('No reset token provided.');
            setIsTokenVerified(true);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reset-password`, {
                token,
                password
            });
            
            setMessage('Your password has been reset successfully. Redirecting to login...');
            
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error resetting password:', err);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenVerified) {
        return <LoadingContainer>Verifying link...</LoadingContainer>;
    }

    if (!isValidToken) {
        return (
            <ErrorContainer>
                <h2>Invalid or Expired Link</h2>
                <p>{error}</p>
                <Link to="/forgot-password" className="link">Request a new password reset link</Link>
            </ErrorContainer>
        );
    }

    return (
        <ResetPasswordContainer>
            <FormContainer>
                <form onSubmit={handleSubmit} className="form">
                    <h2>Reset Your Password</h2>
                    <p className="description">
                        Please enter your new password below.
                    </p>
                    
                    <div className="input-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="input"
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            className="input"
                            minLength="6"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <button type="submit" className="button-submit" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </FormContainer>
        </ResetPasswordContainer>
    );
};

const ResetPasswordContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    font-size: 1.25rem;
    color: #4b5563;
`;

const ErrorContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    
    h2 {
        color: #dc2626;
        margin-bottom: 1rem;
    }
    
    p {
        margin-bottom: 1.5rem;
        color: #6b7280;
    }
    
    .link {
        color: #4f46e5;
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
            text-decoration: underline;
        }
    }
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
        
        &:last-of-type {
            margin-bottom: 1rem;
        }
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
`;

export default ResetPassword;
