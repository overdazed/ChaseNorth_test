import { Link } from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"

import { useState } from 'react';
import axios from 'axios';
import NewsletterLoader from './NewsletterLoader';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowLoader(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, { email });
            setStatus({
                type: 'success',
                message: response.data.message || 'Thank you for subscribing! Check your email for a discount code.'
            });
            setEmail('');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to subscribe. Please try again.';
            setStatus({
                type: 'error',
                message
            });
        } finally {
            setIsSubmitting(false);
            setShowLoader(false);
        }
    };

    // Simulate a longer loading time
    const handleSubmitWithDelay = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowLoader(true);
        setStatus({ type: '', message: '' });

        try {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1250));
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, { email });
            setStatus({
                type: 'success',
                message: response.data.message || 'Thank you for subscribing! Check your email for a discount code.'
            });
            setEmail('');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to subscribe. Please try again.';
            setStatus({
                type: 'error',
                message
            });
        } finally {
            setIsSubmitting(false);
            setShowLoader(false);
        }
    };

    return (
        // <footer className="border-t-[0.5px] border-neutral-200 dark:border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
        <footer className="border-t-[0.1px] border-neutral-200 dark:border-neutral-900 py-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
            <div className="md:col-span-4 flex justify-center">
                <div className="max-w-md mx-8 sm:mx-0 select-none">
                    <h3 className="text-lg text-neutral-800 dark:text-white mb-4">
                        Get your compass and set a clear direction
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-300 mb-4">
                        Carefully chosen releases, honest stories and things we truly stand behind.
                    </p>
                    <p className="font-medium text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                        And a small thank you when you arrive.
                    </p>

                    <form onSubmit={handleSubmitWithDelay} className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="p-3 w-full text-sm pl-5 border border-neutral-200 dark:border-neutral-800 rounded-full
                            focus:outline-none focus:ring-0.5 focus:ring-neutral-500 transition-all
                            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                            required
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            title="Please enter a valid email address (e.g. yourname@example.com)"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-black text-white px-6 py-3 text-sm rounded-full
                            hover:bg-neutral-800 dark:hover:bg-neutral-900 mb-4 transition-colors duration-200
                            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <div className="py-2.5 flex justify-start items-center h-full relative pl-4">
                                    <NewsletterLoader />
                                </div>
                            ) : 'Subscribe'}
                        </button>

                        {status.message && (
                            <p className={`text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {status.message}
                            </p>
                        )}

                        <div className="text-center">
                            <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                                We respect your privacy.
                                No third parties. Unsubscribe anytime.<br/>
                                By signing up, you agree to our{' '}
                                <Link to="/privacy-policy" className="text-neutral-500 hover:underline dark:text-neutral-400">
                                    privacy policy
                                </Link>
                                .
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Newsletter;