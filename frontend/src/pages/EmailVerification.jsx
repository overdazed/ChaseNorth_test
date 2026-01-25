import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    console.error('No verification token provided');
                    navigate('/profile?emailError=no_token');
                    return;
                }

                // Call backend verification endpoint
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/verify-email?token=${token}`);
                
                console.log('Email verification response:', response.data);
                
                // Redirect to profile with success message
                navigate('/profile?emailVerified=true');
                
            } catch (error) {
                console.error('Email verification failed:', error.response?.data || error.message);
                
                // Redirect to profile with error message
                if (error.response?.status === 400) {
                    navigate('/profile?emailError=invalid_token');
                } else if (error.response?.status === 404) {
                    navigate('/profile?emailError=user_not_found');
                } else if (error.response?.data?.message.includes('expired')) {
                    navigate('/profile?emailError=expired');
                } else {
                    navigate('/profile?emailError=verification_failed');
                }
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