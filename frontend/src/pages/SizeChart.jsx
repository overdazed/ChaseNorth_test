import React from 'react';

const SizeChart = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Size Chart
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Find the perfect fit with our size chart.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions about our size chart, our customer support team is here to help.
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
                Size Guide
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Use the following size chart to find the best fit for your outdoor gear. Sizes may vary slightly depending on the product.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-left text-neutral-800 dark:text-white">Size</th>
                      <th className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-left text-neutral-800 dark:text-white">Chest (inches)</th>
                      <th className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-left text-neutral-800 dark:text-white">Waist (inches)</th>
                      <th className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-left text-neutral-800 dark:text-white">Hips (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">S</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">34-36</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">28-30</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">34-36</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">M</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">38-40</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">32-34</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">38-40</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">L</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">42-44</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">36-38</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">42-44</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">XL</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">46-48</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">40-42</td>
                      <td className="py-2 px-4 border-b border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">46-48</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 mt-4">
                For more detailed sizing information, please contact us at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions about our size chart, our customer support team is here to help.
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

export default SizeChart;