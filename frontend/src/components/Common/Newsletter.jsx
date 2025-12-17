import { Link } from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"

const Newsletter = () => {
    return (
        <footer className="border-t py-12">
            {/* Grid Layout */}
            <div className="md:col-span-4 flex justify-center">
                {/* newsletter form*/}
                <div className="max-w-md">
                    <h3 className="text-lg text-gray-800 mb-4">
                        {/*Newsletter*/}
                        Get 10% off your first purchase
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Be the first to know about new products, exclusive events, and special offers.
                    </p>
                    <p className="font-medium text-sm text-gray-600 mb-6">
                        Sign up and get 10% off your first purchase!
                    </p>
                    {/* Newsletter form */}
                    <form className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 w-full text-sm border border-gray-300 rounded-md
                            focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                            required
                        />
                        {/* NewsletterSubmit Button */}
                        <button type="submit" className="w-full bg-black text-white px-6 py-3 text-sm rounded-md hover:bg-gray-800 mb-4">Subscribe</button>
                        <p className="text-gray-500 text-xs">
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
