import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            console.log('Sending request to:', `${apiUrl}/api/users/reset-password/${token}`);

            const response = await fetch(`${apiUrl}/api/users/reset-password/${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password,
                    passwordConfirm: confirmPassword
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <form onSubmit={(e) => { e.preventDefault(); }} className="form" noValidate>
                    <h2>Reset Your Password</h2>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            minLength="6"
                        />
                    </div>

                    <button
                        type="button"
                        className="button-submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </FormContainer>
        </Container>
    );
};

// Reuse the styled components from ForgotPassword
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
`;

export default ResetPassword;