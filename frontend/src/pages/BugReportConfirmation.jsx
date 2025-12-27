// src/pages/BugReportConfirmation.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BugReportConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const returnUrl = location.state?.from || '/';

    useEffect(() => {
        // Auto-redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate(returnUrl, { replace: true });
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, returnUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">Thank you for your help!</h1>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                    Your bug report has been submitted successfully. We'll review it shortly.
                </p>
                <p className="text-sm text-neutral-500 mb-6">
                    You'll be redirected back in a few seconds...
                </p>
                <button
                    onClick={() => navigate(returnUrl, { replace: true })}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Go Back Now
                </button>
            </div>
        </div>
    );
};

export default BugReportConfirmation;