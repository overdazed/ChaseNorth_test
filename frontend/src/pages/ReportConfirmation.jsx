import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const ReportConfirmation = () => {
  const location = useLocation();
  const { referenceNumber, email } = location.state || {
    referenceNumber: 'REF-000000',
    email: 'support@chasenorth.com'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                Report received
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thank you for reporting this issue. We've received your submission and our team is on it.
              </p>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reference Number: {referenceNumber}</h3>
              {/*<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">*/}
              {/*  {referenceNumber}*/}
              {/*</p>*/}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A copy has been sent to {email}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">What happens next?</h3>
              <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="h-5 flex items-center sm:h-6">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2">
                    We'll review your report within 24 hours
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 flex items-center sm:h-6">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2">
                    We'll contact you at {email} if we need more information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 flex items-center sm:h-6">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2">
                    We'll resolve the issue as quickly as possible
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-center">
                <Link
                  to="/my-orders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View my orders
                </Link>
                <Link
                  to="/"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">*/}
        {/*  <p>*/}
        {/*    Need immediate assistance?{' '}*/}
        {/*    <a href="mailto:support@chasenorth.com" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">*/}
        {/*      Contact our support team*/}
        {/*    </a>*/}
        {/*  </p>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default ReportConfirmation;
