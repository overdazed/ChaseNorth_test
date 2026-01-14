import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Return Policy
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Our return policy guidelines and procedures.
              </p>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                30-Day Return Policy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We offer a 30-day return policy for most items. Items must be in their original condition with tags attached. Please contact our customer service team to initiate a return.
              </p>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-300 mb-4">
                <li>Items must be unused and in their original packaging.</li>
                <li>Tags and labels must be attached.</li>
                <li>Proof of purchase is required.</li>
              </ul>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                To initiate a return, please contact us at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;