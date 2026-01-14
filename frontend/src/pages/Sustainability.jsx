import React from 'react';

const Sustainability = () => {
  return (
    <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Sustainability
              </h1>
              <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                Our commitment to a sustainable future.
              </p>
            </div>
            {/* Desktop "Still have questions?" - Hidden on mobile */}
            <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any further questions about our sustainability efforts, our customer support team is here to help.
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
                Our Sustainability Mission
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                At ChaseNorth, we are committed to sustainability and environmental responsibility. Our mission is to create high-quality products while minimizing our impact on the planet.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Sustainable Materials
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We use eco-friendly materials such as organic cotton, recycled polyester, and other sustainable fabrics. Our goal is to reduce waste and promote a circular economy.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Ethical Manufacturing
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Our products are manufactured in facilities that adhere to strict ethical and environmental standards. We ensure fair labor practices and safe working conditions for all workers.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Carbon Footprint Reduction
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We are continuously working to reduce our carbon footprint by optimizing our supply chain, using renewable energy sources, and implementing energy-efficient practices.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Packaging and Shipping
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Our packaging is made from recycled and biodegradable materials. We also strive to minimize packaging waste and use carbon-neutral shipping methods whenever possible.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Community Engagement
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We actively engage with our community to promote sustainability awareness and support environmental initiatives. Our goal is to inspire others to join us in our mission.
              </p>

              <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                Future Goals
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                We are committed to continuously improving our sustainability practices. Our future goals include achieving zero waste, using 100% renewable energy, and becoming a carbon-neutral company.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                If you have any questions about our sustainability efforts, you can contact us at any time at <a href="mailto:support@chasenorth.com" className="text-blue-600 dark:text-blue-400">support@chasenorth.com</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile "Still have questions?" - Only shows on mobile */}
        <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            If you have any further questions about our sustainability efforts, our customer support team is here to help.
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

export default Sustainability;