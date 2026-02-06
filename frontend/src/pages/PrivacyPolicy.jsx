import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Privacy Policy
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                How we collect, use, and protect your data.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions about our privacy policy, our customer support team is here to help.
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
                Introduction
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                At ChaseNorth, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from us.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We may collect personal information that you voluntarily provide to us when you register on our website, make a purchase, subscribe to our newsletter, or contact us for support. This information may include:
              </p>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-300 mb-4">
                <li>Name and contact information (email address, phone number, shipping and billing address)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Account credentials</li>
                <li>Purchase history and preferences</li>
                <li>Communications and customer support interactions</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-300 mb-4">
                <li>Processing and fulfilling your orders</li>
                <li>Providing customer service and support</li>
                <li>Sending promotional communications and newsletters (with your consent)</li>
                <li>Improving our website, products, and services</li>
                <li>Personalizing your shopping experience</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Information Sharing and Disclosure
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We do not sell or rent your personal information to third parties. However, we may share your information with:
              </p>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-300 mb-4">
                <li>Service providers who assist in our operations (payment processing, shipping, analytics)</li>
                <li>Legal and regulatory authorities when required by law</li>
                <li>Business partners with your consent</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data. You may also have the right to data portability and to object to certain processing activities.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Children's Privacy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Our website is not intended for individuals under the age of 16. We do not knowingly collect personal information from children.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We encourage you to review this Privacy Policy periodically.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                This Privacy Policy was last updated on February 6, 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions about our privacy policy, our customer support team is here to help.
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

export default PrivacyPolicy;
