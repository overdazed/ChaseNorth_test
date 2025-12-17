import React from 'react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Still need help?</h2>
        <p className="text-gray-600 mb-4">
          If you can't find the answer to your question, our customer support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@chasenorth.com"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-center"
          >
            Contact Us
          </a>
          {/*<a*/}
          {/*  href="#"*/}
          {/*  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-center"*/}
          {/*>*/}
          {/*  Call Support*/}
          {/*</a>*/}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
