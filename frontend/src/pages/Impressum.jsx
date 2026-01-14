import React from 'react';

const Impressum = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Impressum
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Our legal information and contact details.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => (window.location.href = "mailto:support@chasenorth.com")}
                    className="w-full bg-black text-white px-6 py-3 text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors duration-200"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                ChaseNorth GmbH<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                Germany
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Contact Details
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Email: <a href="mailto:info@chasenorth.com" className="text-blue-600 dark:text-blue-400">info@chasenorth.com</a><br />
                Phone: +49 (0) 30 12345678<br />
                Fax: +49 (0) 30 12345679
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Legal Representation
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Represented by: John Doe
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                VAT Identification Number
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                VAT ID: DE123456789
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Responsible for Content
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                John Doe<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                Germany
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Dispute Resolution
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr/" className="text-blue-600 dark:text-blue-400">https://ec.europa.eu/consumers/odr/</a>.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any questions about our Impressum, you can contact us at any time at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => (window.location.href = "mailto:support@chasenorth.com")}
                className="w-full bg-black text-white px-6 py-3 text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;