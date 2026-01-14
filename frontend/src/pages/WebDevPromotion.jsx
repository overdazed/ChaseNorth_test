import React from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/Layout/UserLayout';

const WebDevPromotion = () => {
  return (
    <UserLayout>
      <div className="min-h-screen bg-neutral-900 text-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Web Development Services</h1>
          <p className="text-lg md:text-xl mb-8 text-neutral-300">
            Looking for a professional website? We offer custom web development services tailored to your needs.
          </p>
          <div className="mb-8">
            <Link
              to="https://www.svet.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
            >
              Visit Svet.codes
            </Link>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Services</h2>
            <ul className="text-left max-w-md mx-auto space-y-2 text-neutral-300">
              <li>- Custom Website Development</li>
              <li>- E-commerce Solutions</li>
              <li>- Responsive Design</li>
              <li>- SEO Optimization</li>
              <li>- Maintenance and Support</li>
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default WebDevPromotion;