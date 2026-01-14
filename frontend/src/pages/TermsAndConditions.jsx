import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Terms and Conditions
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Our terms and conditions and legal notices.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions about our terms and conditions, our customer support team is here to help.
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
                1. Scope of Application
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                These Terms and Conditions apply to all contracts that you conclude with us regarding the use of our website and the purchase of products.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                2. Contract Conclusion
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                The purchase contract is concluded when you complete your order and we confirm it. The confirmation is sent via email.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                3. Prices and Payment Terms
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                All prices are stated in euros and include the statutory value-added tax. Payment can be made by credit card, PayPal, or other offered payment methods.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                4. Delivery and Shipping
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Delivery takes place within the specified delivery times. Shipping costs are shown separately and depend on the order value and delivery country.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                5. Right of Withdrawal
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                You have the right to withdraw from the contract within 14 days without giving any reason. The withdrawal period begins upon receipt of the goods.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                6. Warranty
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                The statutory warranty provisions apply to our products. Defects must be reported to us immediately upon discovery.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                7. Data Protection
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Your personal data will be processed in accordance with our privacy policy. This can be found on our website.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                8. Final Provisions
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If individual provisions of these Terms and Conditions are invalid, the validity of the remaining provisions remains unaffected.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any questions about our Terms and Conditions, you can contact us at any time at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions about our terms and conditions, our customer support team is here to help.
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

export default TermsAndConditions;