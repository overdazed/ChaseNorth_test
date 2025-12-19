import { Link } from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"

import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:9000/api/newsletter/subscribe', { email });
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
        }
    };

    return (
        <footer className="border-t border-gray-200 dark:border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
            <div className="md:col-span-4 flex justify-center">
                <div className="max-w-md mx-8 sm:mx-0">
                    <h3 className="text-lg text-gray-800 dark:text-white mb-4">
                        Get 15% off your first purchase
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                        Be the first to know about new products, exclusive events, and special offers.
                    </p>
                    <p className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Sign up and get 10% off your first purchase!
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="p-3 w-full text-sm pl-5 border border-neutral-200 dark:border-neutral-800 rounded-full
                            focus:outline-none focus:ring-0.5 focus:ring-gray-500 transition-all
                            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                            required
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            title="Please enter a valid email address (e.g. yourname@example.com)"
                        />
                        <SubmitButtonWrapper>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={isSubmitting ? 'submitting' : ''}
                            >
                                <span className="txt">subscribe</span>
                                <span className="txt2">sent!</span>
                                <span className="loader-container">
                                <span className="loader" />
                                </span>
                            </button>
                        </SubmitButtonWrapper>

                        {status.message && (
                            <p className={`text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {status.message}
                            </p>
                        )}

                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Data is not given to third parties and unsubscription is possible at any time.
                            With the subscription you accept our privacy policy.
                        </p>
                    </form>
                </div>
            </div>
        </footer>
    );
};

const SubmitButtonWrapper = styled.div`
  button {
    background-color: transparent;
    width: 100%;
    height: 3.3em;
    border: 2px solid #1abc9c;
    border-radius: 25px;
    font-weight: bold;
    text-transform: uppercase;
    color: #1abc9c;
    padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  button .txt {
    transition: .4s ease-in-out;
    position: absolute;
  }

  button .txt2 {
    transform: translateY(1em) scale(0);
    color: #fff;
    position: absolute;
  }

  button .loader-container {
    height: 100%;
    width: 100%;
    background-color: transparent;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;
    overflow: hidden;
  }

  button .loader-container .loader {
    height: 100%;
    width: 100%;
    background-color: #1abc9c;
    border-radius: inherit;
    transform: translateX(-100%);
  }

  button.submitting {
    transition: .4s ease-in-out .4s;
    animation: scaling 1.5s ease-in-out 0s 1 both;
  }

  button.submitting .txt {
    position: absolute;
    transform: translateY(-5em);
    transition: .4s ease-in-out;
  }

  button.submitting .txt2 {
    transform: translateY(0) scale(1);
    transition: .3s ease-in-out 1.7s;
  }

  button.submitting .loader {
    display: block;
    transform: translate(0);
    transition: 2s cubic-bezier(0.2, 0.5, 0.1, 1) 0.4s;
  }

  @keyframes scaling {
    20% {
      height: 1.5em;
    }

    80% {
      height: 1.5em;
    }

    100% {
      height: 3.3em;
    }
  }
`;

export default Newsletter;