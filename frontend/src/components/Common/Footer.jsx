import { Link } from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"

const Footer = () => {
    return (
        <footer className="border-t py-12">
            {/* Grid Layout */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
                {/*  Support Links */}
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-600 ">
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Features</Link>
                        </li>
                    </ul>
                </div>
                {/* Shop Links */}
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
                    <ul className="space-y-2 text-gray-600 ">
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Men's Top Wear</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Women's Top Wear</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Men's Bottom Wear</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Women's Bottom Wear</Link>
                        </li>
                    </ul>
                </div>
                {/*  Support Links */}
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-600 ">
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">Features</Link>
                        </li>
                    </ul>
                </div>
                {/* Follow Us */}
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
                    <div className="flex items-center space-x-4 mb-6">
                        <a
                            href="http://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-600"
                        >
                            <TbBrandMeta className="h-5 w-5" />
                        </a>
                        <a
                            href="http://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-600"
                        >
                            <IoLogoInstagram className="h-5 w-5" />
                        </a>
                        <a
                            href="http://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-600"
                        >
                            <RiTwitterXLine className="h-4 w-4" />
                        </a>
                    </div>
                    <p className="text-gray-500">Call Us</p>
                    <p>
                        <FiPhoneCall className="inline-block mr-2" />
                        +1 (234) 567-890
                    </p>
                </div>
            </div>
            {/* Footer Bottom: Copyright Text */}
            <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 tracking-tighter text-center">
                    {/* Copyright Text */}
                    © 2025 ChaseNorth. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
export default Footer
