import React from 'react';
import { Link } from 'react-router-dom';
import {TbBrandMeta} from "react-icons/tb";
import {IoLogoInstagram} from "react-icons/io";
import {RiTwitterXLine} from "react-icons/ri";
//import {FiPhoneCall} from "react-icons/fi";
import {TbMail} from "react-icons/tb"

const NewFooter = () => {
  return (
    <div 
      className="relative w-full bg-neutral-900"
      style={{
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        minHeight: '300px',
        height: 'auto',
        marginTop: 'auto' // This helps push the footer to the bottom
      }}
    >
      <div className="relative w-full">
        <div className="w-full min-h-[400px] sm:min-h-[600px] lg:min-h-[800px] py-4 sm:py-6 lg:py-8 px-4 sm:px-6 flex flex-col justify-between">
            <div className="flex shrink-0 gap-8 sm:gap-12 lg:gap-20">
              <div className="flex flex-col gap-1 sm:gap-2">
                {/* */}
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">Customer Service</h3>
                <Link
                    to="/faq"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  FAQ / Help
                </Link>
                <Link
                    to="/return-policy"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Return policy
                </Link>
                <Link
                    to="/size"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Size chart
                </Link>
                <Link
                    to="/delivery"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Delivery
                </Link>
                <Link
                    to="/payments"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Payments
                </Link>
                <Link
                    to="/gift-card"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Gift card
                </Link>
                <Link
                    to="/sdfgdsfg"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                </Link>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">About</h3>
                <Link
                  to="/projects"
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Projects
                </Link>
                <Link
                  to="/mission"
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Our Mission
                </Link>
                <Link
                  to="/contact"
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Contact Us
                </Link>
              </div>
              {/*<div className="flex flex-col gap-1 sm:gap-2">*/}
              {/*  <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">Education</h3>*/}
              {/*  <Link*/}
              {/*    to="/news"*/}
              {/*    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    News*/}
              {/*  </Link>*/}
              {/*  <Link*/}
              {/*    to="/learn"*/}
              {/*    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    Learn*/}
              {/*  </Link>*/}
              {/*  <Link*/}
              {/*    to="/publications"*/}
              {/*    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    Publications*/}
              {/*  </Link>*/}
              {/*</div>*/}
              {/*<div className="flex flex-col gap-1 sm:gap-2">*/}
              {/*  <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">About</h3>*/}
              {/*  <Link*/}
              {/*      to="/projects"*/}
              {/*      className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    Projects*/}
              {/*  </Link>*/}
              {/*  <Link*/}
              {/*      to="/mission"*/}
              {/*      className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    Our Mission*/}
              {/*  </Link>*/}
              {/*  <Link*/}
              {/*      to="/contact"*/}
              {/*      className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"*/}
              {/*  >*/}
              {/*    Contact Us*/}
              {/*  </Link>*/}
              {/*</div>*/}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">ChaseNorth</h3>
                <Link
                    to="/about"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  About Us
                </Link>
                <Link
                    to="/mission"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Our Mission
                </Link>
                <Link
                    to="/contact"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Contact Us
                </Link>
                <Link
                    to="/sustainability"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Sustainability
                </Link>
                <Link
                    to="/agb"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  AGB
                </Link>
                <Link
                    to="/impressum"
                    className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base"
                >
                  Impressum
                </Link>
              </div>
              <div className="ml-auto">
                {/*<h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>*/}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
                  <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-gray-600"
                  >
                    <TbBrandMeta className="h-5 w-5" />
                  </a>
                  <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-gray-600"
                  >
                    <IoLogoInstagram className="h-5 w-5" />
                  </a>
                  <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-gray-600"
                  >
                    <RiTwitterXLine className="h-4 w-4" />
                  </a>
                  <a
                      href="mailto:shop@chasenorth.com"
                      // target="_blank"
                      // rel="no opener no referrer"
                      className="text-neutral-400 hover:text-gray-600"
                  >
                    <TbMail className="h-5 w-5" />
                  </a>
                </div>
                {/*<p className="flex items-center justify-end text-neutral-400">Call Us</p>*/}
                {/*<p>*/}
                {/*  <FiPhoneCall className=" text-white inline-block mr-2" />*/}
                {/*  <span className="text-white">+1 (234) 567-890</span>*/}
                {/*</p>*/}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 w-full">
              <div className="w-full sm:w-auto">
                <h1 className="text-[16vw] xs:text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-[0.8] mt-4 sm:mt-6 lg:mt-10 text-white font-bold tracking-tight">
                  ChaseNorth
                </h1>
                <p className="text-white text-sm sm:text-base mt-2 sm:mt-0 sm:hidden">
                  © {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
              <p className="hidden sm:block text-white text-sm sm:text-base text-right">
                © {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewFooter;
