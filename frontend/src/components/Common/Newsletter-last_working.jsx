import { Link } from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"


const Newsletter = () => {
    return (
        <footer className="border-t border-gray-200 dark:border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
            {/* Grid Layout */}
            <div className="md:col-span-4 flex justify-center">
                {/* newsletter form*/}
                <div className="max-w-md mx-8 sm:mx-0">
                    <h3 className="text-lg text-gray-800 dark:text-white mb-4">
                        {/*Newsletter*/}
                        Get 15% off your first purchase
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                        Be the first to know about new products, exclusive events, and special offers.
                    </p>
                    <p className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Sign up and get 10% off your first purchase!
                    </p>
                    {/* Newsletter form */}
                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 w-full text-sm pl-5 border border-neutral-200 dark:border-neutral-800 rounded-full
                            focus:outline-none focus:ring-0.5 focus:ring-gray-500 transition-all
                            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                            required
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            title="Please enter a valid email address (e.g. yourname@example.com)"
                            onInvalid={(e) => {
                                if (e.target.validity.valueMissing) {
                                    e.target.setCustomValidity('Please enter an email address');
                                } else if (e.target.validity.patternMismatch) {
                                    e.target.setCustomValidity('Please enter a valid email address (e.g. yourname@example.com)');
                                }
                            }}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        {/* NewsletterSubmit Button */}
                        <button 
                            type="submit" 
                            className="w-full bg-black dark:black text-white dark:text-white px-6 py-3 text-sm rounded-full
                            hover:bg-gray-800 dark:hover:bg-neutral-900 mb-4 transition-colors duration-200"
                        >
                            Subscribe
                        </button>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Data is not given to third parties and unsubscription is possible at any time.
                            With the subscription you accept our privacy policy.
                        </p>
                    </form>
                </div>
            </div>
        </footer>
    )
}
export default Newsletter
