import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbMail } from "react-icons/tb"
import Loader from './Loader';

const NewFooter = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
      <div className="relative w-full bg-neutral-900" style={{
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        minHeight: '300px',
        overflow: 'hidden',
        marginTop: 'auto'
      }}>
        <div className="relative w-full select-none">
          <div className="w-full min-h-[400px] sm:min-h-[600px] lg:min-h-[800px] py-4 sm:py-6 lg:py-8 px-4 sm:px-6 flex flex-col justify-between">
            {/* Mobile Accordion View */}
            <div className="md:hidden space-y-4 text-neutral-50">
              {/* Customer Service Section */}
              <div className="border-b border-neutral-700 pb-2">
                <button
                    onClick={() => toggleSection('customerService')}
                    className="flex justify-between items-center w-full text-left py-2"
                >
                  <h3 className="uppercase text-neutral-400 text-sm">Customer Service</h3>
                  <span className="text-neutral-400 text-lg">
                  {expandedSection === 'customerService' ? '−' : '+'}
                </span>
                </button>
                {expandedSection === 'customerService' && (
                    <div className="space-y-2 pl-4 py-2">
                      <Link to="/faq" className="block text-neutral-50 hover:text-neutral-400 text-sm">FAQ / Help</Link>
                      <Link to="/return-policy" className="block text-neutral-50 hover:text-neutral-400 text-sm">Return policy</Link>
                      <Link to="/size" className="block text-neutral-50 hover:text-neutral-400 text-sm">Size chart</Link>
                      <Link to="/delivery" className="block text-neutral-50 hover:text-neutral-400 text-sm">Delivery</Link>
                      <Link to="/payments" className="block text-neutral-50 hover:text-neutral-400 text-sm">Payments</Link>
                      <Link to="/gift-card" className="block text-neutral-50 hover:text-neutral-400 text-sm">Gift card</Link>
                    </div>
                )}
              </div>

              {/* About Section */}
              <div className="border-b border-neutral-700 pb-2">
                <button
                    onClick={() => toggleSection('about')}
                    className="flex justify-between items-center w-full text-left py-2"
                >
                  <h3 className="uppercase text-neutral-400 text-sm">About</h3>
                  <span className="text-neutral-400 text-lg">
                  {expandedSection === 'about' ? '−' : '+'}
                </span>
                </button>
                {expandedSection === 'about' && (
                    <div className="space-y-2 pl-4 py-2">
                      <Link to="/projects" className="block text-neutral-50 hover:text-neutral-400 text-sm">Projects</Link>
                      <Link to="/mission" className="block text-neutral-50 hover:text-neutral-400 text-sm">Our Mission</Link>
                      <Link to="/contact" className="block text-neutral-50 hover:text-neutral-400 text-sm">Contact Us</Link>
                    </div>
                )}
              </div>

              {/* Chase North Section */}
              <div className="border-b border-neutral-700 pb-2">
                <button
                    onClick={() => toggleSection('chaseNorth')}
                    className="flex justify-between items-center w-full text-left py-2"
                >
                  <h3 className="uppercase text-neutral-400 text-sm">ChaseNorth</h3>
                  <span className="text-neutral-400 text-lg">
                  {expandedSection === 'chaseNorth' ? '−' : '+'}
                </span>
                </button>
                {expandedSection === 'chaseNorth' && (
                    <div className="space-y-2 pl-4 py-2">
                      <Link to="/about" className="block text-neutral-50 hover:text-neutral-400 text-sm">About Us</Link>
                      <Link to="/mission" className="block text-neutral-50 hover:text-neutral-400 text-sm">Our Mission</Link>
                      <Link to="/contact" className="block text-neutral-50 hover:text-neutral-400 text-sm">Contact Us</Link>
                      <Link to="/sustainability" className="block text-neutral-50 hover:text-neutral-400 text-sm">Sustainability</Link>
                      <Link to="/terms-and-conditions" className="block text-neutral-50 hover:text-neutral-400 text-sm">Terms and Conditions</Link>
                      <Link to="/impressum" className="block text-neutral-50 hover:text-neutral-400 text-sm">Impressum</Link>
                      {/* Need a website? Link - Added for mobile view */}
                      <div className="flex items-center justify-left">
                        <Loader />
                        <Link to="/need-a-website" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm">
                          Need a website?
                        </Link>
                      </div>
                    </div>
                )}
              </div>

              {/* Social Icons - Moved here for mobile view */}
              <div className="flex justify-center space-x-6 pt-4 items-center">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50">
                  <TbBrandMeta className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50">
                  <IoLogoInstagram className="h-5 w-5" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50 flex items-center">
                  <RiTwitterXLine className="h-4 w-4" />
                </a>
                <a href="mailto:shop@chasenorth.com" className="text-neutral-400 hover:text-neutral-50">
                  <TbMail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex shrink-0 gap-8 sm:gap-12 lg:gap-20">
              {/* Customer Service Section */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">Customer Service</h3>
                <Link to="/faq" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  FAQ / Help
                </Link>
                <Link to="/return-policy" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Return Policy
                </Link>
                <Link to="/size-chart" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Size chart
                </Link>
                <Link to="/delivery" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Delivery
                </Link>
                <Link to="/payments" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Payments
                </Link>
                <Link to="/gift-card" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Gift card
                </Link>
              </div>

              {/* About Section */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">About</h3>
                <Link to="/projects" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Projects
                </Link>
                <Link to="/mission" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Our Mission
                </Link>
                <Link to="/contact" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Contact Us
                </Link>
              </div>

              {/* Chase North Section */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">ChaseNorth</h3>
                <Link to="/about" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  About Us
                </Link>
                <Link to="/mission" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Our Mission
                </Link>
                <Link to="/contact" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Contact Us
                </Link>
                <Link to="/sustainability" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Sustainability
                </Link>
                <Link to="/terms-and-conditions" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Terms and Conditions
                </Link>
                <Link to="/privacy-policy" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Privacy Policy
                </Link>
                <Link to="/impressum" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                  Impressum
                </Link>
                <div className="flex items-center gap-2">
                  <Loader />
                  <Link to="/need-a-website" className="text-neutral-50 hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">
                    Need a website?
                  </Link>
                </div>
              </div>

              {/* Social Icons */}
              <div className="ml-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50">
                    <TbBrandMeta className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50">
                    <IoLogoInstagram className="h-5 w-5" />
                  </a>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-50">
                    <RiTwitterXLine className="h-4 w-4" />
                  </a>
                  <a href="mailto:shop@chasenorth.com" className="text-neutral-400 hover:text-neutral-50">
                    <TbMail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 w-full mt-8">
              <div className="w-full sm:w-auto">
                <h1 className="text-[16vw] xs:text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-[0.8] mt-4 sm:mt-6 lg:mt-10 text-neutral-50 font-bold tracking-tight">
                  ChaseNorth
                </h1>
                <p className="text-neutral-50 text-sm sm:text-base mt-2 sm:mt-0 md:hidden">
                  © {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
              <p className="hidden md:block text-neutral-50 text-sm sm:text-base text-right">
                © {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default NewFooter;