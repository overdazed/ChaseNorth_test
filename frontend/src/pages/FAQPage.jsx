import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. Follow the steps to enter your shipping and payment information to complete your purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted for your security.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order has shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website or the shipping carrier\'s website.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in their original condition with tags attached. Please contact our customer service team to initiate a return.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times may vary depending on your location.'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'Our customer support team is available 24/7. You can reach us via email at support@chasenorth.com.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
      <div className="min-h-600px bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {/* Grid */}
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <div className="max-w-xs">
                <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
                  Frequently<br />asked questions
                </h1>
                <p className="mt-1 hidden md:block text-neutral-600 dark:text-neutral-400">
                  Answers to the most frequently asked questions.
                </p>
              </div>
              {/* Desktop "Still need help?" - Hidden on mobile */}
              <div className="hidden md:block mt-12 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still need help?</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  If you can't find the answer to your question, our customer support team is here to help.
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
              {/* Search Bar */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-neutral-400 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {/* Accordion */}
              <div className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
                {filteredFaqs.map((faq, index) => (
                    <div key={index} className="py-6">
                      <button
                          onClick={() => toggleAccordion(index)}
                          className="group inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-neutral-800 rounded-lg transition hover:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:hover:text-neutral-400"
                      >
                        {faq.question}
                        <svg
                            className={`shrink-0 size-5 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                                activeIndex === index ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      <div
                          className={`overflow-hidden transition-all duration-300 ${
                              activeIndex === index ? "max-h-96 mt-2" : "max-h-0"
                          }`}
                      >
                        <p className="text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile "Still need help?" - Only shows on mobile */}
          <div className="md:hidden mt-8 shadow-md bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Still need help?</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              If you can't find the answer to your question, our customer support team is here to help.
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

export default FAQPage;
