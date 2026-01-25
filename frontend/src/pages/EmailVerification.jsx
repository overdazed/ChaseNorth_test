import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmail = () => {
            try {
                if (!token) {
                    console.error('No verification token provided');
                    navigate('/profile?emailError=no_token');
                    return;
                }

                // Instead of calling backend API, redirect directly to backend verification endpoint
                // This avoids CORS issues since the browser will handle the redirect
                const verificationUrl = `${import.meta.env.VITE_API_URL}/api/users/verify-email?token=${token}`;
                
                console.log('Redirecting to backend verification:', verificationUrl);
                
                // Perform the redirect
                window.location.href = verificationUrl;
                
            } catch (error) {
                console.error('Email verification failed:', error.message);
                navigate('/profile?emailError=verification_failed');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            navigate('/profile?emailError=no_token');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Verifying Your Email</h2>
                <p className="text-gray-600 mb-6">Please wait while we verify your email address...</p>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;