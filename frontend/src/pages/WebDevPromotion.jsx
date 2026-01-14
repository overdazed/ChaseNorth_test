import React from 'react';
// import AvailableForNewProjectButton from '../components/Common/AvailableForNewProjectButton';

const WebDevPromotion = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Web Development Services
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Professional web development services tailored to your needs.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Interested in our services?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any questions or would like to discuss your project, feel free to reach out to us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => (window.location.href = "mailto:contact@svet.codes")}
                    className="w-full bg-black text-white px-6 py-3 text-sm rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors duration-200"
                >
                  Contact Us
                </button>
                {/*<AvailableForNewProjectButton />*/}
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We offer a wide range of web development services to help you build a strong online presence. Our team of experts is dedicated to delivering high-quality solutions tailored to your specific needs.
              </p>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-300 mb-4">
                <li>Custom Website Development</li>
                <li>E-commerce Solutions</li>
                <li>Responsive Design</li>
                <li>SEO Optimization</li>
                <li>Maintenance and Support</li>
              </ul>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                To learn more about our services or to discuss your project, please visit us at <a href="https://www.svet.codes" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">svet.codes</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Interested in our services?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any questions or would like to discuss your project, feel free to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => (window.location.href = "mailto:contact@svet.codes")}
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

export default WebDevPromotion;