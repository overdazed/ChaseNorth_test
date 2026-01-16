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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white">
                Report received
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Thank you for reporting this issue.
                <br />
                We've received your submission and our team is on it.
              </p>
            </div>

            <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Reference Number: {referenceNumber}</h3>
              {/*<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">*/}
              {/*  {referenceNumber}*/}
              {/*</p>*/}
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                A copy has been sent to {email} <br />
                <p className="text-[0.6rem]">(If you don’t see it, please check your spam or junk folder.)</p>
              </p>
            </div>

            <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">What happens next?</h3>
              <ul className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
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

            <div className="mt-10 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <div className="flex justify-center gap-6">
                <Link
                  to="/my-orders"
                  className="flex-1 h-12 flex items-center justify-center rounded-full text-sm font-slim transition-colors duration-200 bg-black text-neutral-50 hover:bg-neutral-700"
                >
                  View my orders
                </Link>
                <Link
                  to="/"
                  className="flex-1 h-12 flex items-center justify-center rounded-full text-sm font-slim transition-colors duration-200 hover:bg-neutral-700 text-neutral-50 bg-black"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            Need immediate assistance?{' '}
            <a href="mailto:support@chasenorth.com" className="font-bold text-accent hover:text-red-600 dark:text-red-700 dark:hover:text-red-600">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmation;
