import { useState, useEffect } from 'react';
import { 
    FaQuestionCircle, 
    FaTicketAlt, 
    FaHeadset, 
    FaExternalLinkAlt, 
    FaImage, 
    FaFileAlt, 
    FaPlus, 
    FaBug,
    FaEnvelope,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SupportAndHelp = ({ showOnlyFaq = false, onTabChange }) => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState(showOnlyFaq ? 'faq' : 'faq');
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Medium',
        attachments: []
    });

    useEffect(() => {
        if (!showOnlyFaq) {
            const fetchUserReports = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/reports/user/${user.email}`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch reports');
                    }

                    const data = await response.json();
                    setReports(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Error fetching reports:', error);
                    setReports([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserReports();
        }
    }, [user.email, showOnlyFaq, API_URL]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.subject.trim() || !formData.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', user?.name || 'Guest User');
            formDataToSend.append('email', user?.email || 'no-email@example.com');
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('priority', formData.priority);

            // Append attachments
            formData.attachments.forEach((file, index) => {
                formDataToSend.append('attachments', file);
            });

            console.log('Sending request with data:', {
                name: user?.name || 'Guest User',
                email: user?.email || 'no-email@example.com',
                subject: formData.subject,
                message: formData.message,
                priority: formData.priority,
                attachments: formData.attachments.length
            });

            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                credentials: 'include',
                body: formDataToSend
            });
            
            // Debug: Log what was actually sent
            console.log('FormData entries:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            const data = await response.json();
            console.log('Server response:', { status: response.status, data });

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    // Show each validation error
                    data.errors.forEach(error => {
                        toast.error(`${error.param}: ${error.msg}`);
                    });
                }
                throw new Error(data.message || `Failed to send message. Status: ${response.status}`);
            }

            toast.success('Your message has been sent successfully!');
            setShowContactForm(false);
            setFormData({
                subject: '',
                message: '',
                priority: 'Medium',
                attachments: []
            });
        } catch (error) {
            console.error('Error submitting contact form:', error);
            if (error.message.includes('Validation failed')) {
                toast.error('Validation failed. Please check all required fields and try again.');
            } else {
                toast.error(error.message || 'Failed to send message. Please try again.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Submitted': return 'bg-blue-100 text-blue-800';
            case 'In Review': return 'bg-yellow-100 text-yellow-800';
            case 'Needs Info': return 'bg-orange-100 text-orange-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid date';
        }
    };

    const getFileIcon = (filename) => {
        if (!filename) return <FaFileAlt className="text-gray-400" />;
        
        const extension = filename.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        
        if (imageExtensions.includes(extension)) {
            return <FaImage className="text-blue-500" />;
        }
        
        return <FaFileAlt className="text-gray-500" />;
    };

    // Check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };
    
    const handleReportBug = () => {
        navigate('/bug-report', {
            state: { 
                reportType: 'bug',
                activeTab: 'reports'
            } 
        });
    };
    
    // FAQ data
    const faqData = [
        {
            question: 'How do I track my order?',
            answer: (
                <span>
                    You can track your order by visiting the{' '}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            onTabChange && onTabChange('orders');
                        }}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        My Orders
                    </button>{' '}
                    section in your profile. There you will find detailed information about your order status and tracking number if available.
                </span>
            ),
            additionalInfo: 'Orders typically ship within 1-2 business days. You will receive a confirmation email with tracking information once your order ships.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.',
            additionalInfo: (
                <span>
                    To start a return, please visit our{' '}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            onTabChange && onTabChange('returns');
                        }}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Returns Center
                    </button>{' '}
                    in your account.
                </span>
            )
        },
        {
            question: 'How do I contact customer support?',
            answer: (
                <span>
                    You can contact our support team through the{' '}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setShowContactForm(true);
                        }}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Contact Us
                    </button>{' '}
                    form above or by emailing{' '}
                    <a 
                        href="mailto:support@chasenorth.com" 
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        support@chasenorth.com
                    </a>{' '}
                    directly.
                </span>
            ),
            additionalInfo: 'Average response time is within 24-48 hours on business days.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: (
                <span>
                    Please see our{' '}
                    <a 
                        href="/payments" 
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/payments');
                        }}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Payments
                    </a>{' '}
                    page. We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay.
                </span>
            ),
            additionalInfo: 'All transactions are secure and encrypted.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'No, we ship to european countries incl. Switzerland. Shipping costs and delivery times vary by destination.',
            // additionalInfo: 'Please note that international orders may be subject to customs fees and import duties which are the responsibility of the customer.'
        }
    ];

    return (
        <div className={`p-6 ${isDarkMode ? 'bg-transparent' : 'bg-neutral-50'} rounded-lg shadow-sm`}>
            <div className="flex flex-col">


                {/* Main Content */}
                <div className="w-full">
                    {(activeTab === 'faq' || showOnlyFaq) ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">Help & Support</h1>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <button 
                                    onClick={() => navigate('/faq')}
                                    className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                                >
                                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                        <FaQuestionCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium">FAQs</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Find answers to common questions</p>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => setShowContactForm(true)}
                                    className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                                >
                                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                                        <FaEnvelope className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium">Contact Us</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Send us a message</p>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={handleReportBug}
                                    className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                                >
                                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
                                        <FaBug className="text-red-600 dark:text-red-400 text-xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium">Report a Bug</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Found an issue? Let us know</p>
                                    </div>
                                </button>
                            </div>

                            {/* FAQ Section */}
                            <div className="min-h-[400px] bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50 mb-8">
                                        Frequently asked questions
                                    </h3>

                                    <div className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
                                        {faqData.map((faq, index) => (
                                            <div key={index} className="py-6">
                                                <button
                                                    onClick={() => toggleFaq(index)}
                                                    className="group inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-neutral-800 rounded-lg transition hover:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:hover:text-neutral-400"
                                                >
                                                    {faq.question}
                                                    <svg
                                                        className={`shrink-0 size-5 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                                                            expandedFaq === index ? "rotate-180" : ""
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
                                                        expandedFaq === index ? "max-h-96 mt-2" : "max-h-0"
                                                    }`}
                                                >
                                                    <div className="text-neutral-600 dark:text-neutral-400">
                                                        {typeof faq.answer === 'string' ? (
                                                            <p>{faq.answer}</p>
                                                        ) : (
                                                            faq.answer
                                                        )}
                                                        {faq.additionalInfo && (
                                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                    <span className="font-medium">Note: </span>
                                                                    {faq.additionalInfo}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">Your Reports</h1>
                                <button
                                    onClick={() => navigate('/report')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <FaPlus /> New Report
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">Loading your reports...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500 dark:text-red-400">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No reports found</h3>
                                    <p className="mt-1 text-gray-500 dark:text-gray-400">You haven't submitted any reports yet.</p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate('/report')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <FaPlus className="mr-2" /> Create Your First Report
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                                        <thead className={`${isDarkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Report</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">View</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                                            {reports.map((report) => (
                                                <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <FaFileAlt className="h-10 w-10 text-gray-400" aria-hidden="true" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {report.problemType || 'Report'}
                                                                </div>
                                                                <div className="text-gray-500 dark:text-gray-400">
                                                                    #{report._id.substring(0, 8)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            report.status === 'Resolved' 
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                                : report.status === 'In Review' 
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                                    : report.status === 'Rejected'
                                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                            {report.status || 'Submitted'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => navigate(`/report/${report._id}`)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            View<span className="sr-only">, {report._id}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Contact Form Modal */}
                {showContactForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Contact Support</h3>
                                    <button
                                        onClick={() => setShowContactForm(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-2"
                                    >
                                        <span className="text-2xl">&times;</span>
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={user?.name || ''}
                                                readOnly
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-neutral-700 dark:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                readOnly
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-neutral-700 dark:text-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                            required
                                            placeholder="Briefly describe your issue"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                            rows="5"
                                            required
                                            placeholder="Please provide as much detail as possible about your issue..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                            >
                                                <option value="Low">Low - General question</option>
                                                <option value="Medium">Medium - Important issue</option>
                                                <option value="High">High - Urgent problem</option>
                                                <option value="Critical">Critical - Site not working</option>
                                            </select>
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachments</label>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                multiple
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                            />
                                            {formData.attachments.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {formData.attachments.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-neutral-700 rounded">
                                                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAttachment(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <span className="text-xl">&times;</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full">
                                            <button
                                                type="submit"
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaEnvelope /> Send Message
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        By submitting this form, you agree to our <a href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</a> and <a href="/terms-and-conditions" className="text-blue-600 hover:underline dark:text-blue-400">Terms and conditions</a>.
                                    </div>
                                </form>
                            </div>
                            
                            <div className={`p-4 ${isDarkMode ? 'bg-neutral-900' : 'bg-gray-50'} rounded-b-lg`}>
                                <h4 className="font-medium mb-2">Other ways to contact us:</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-500 mr-2" />
                                        <span>Email: </span>
                                        <a href="mailto:support@chasenorth.com" className="text-blue-600 hover:underline ml-1 dark:text-blue-400">
                                            support@chasenorth.com
                                        </a>
                                    </div>
                                    {/*<div className="flex items-center">*/}
                                    {/*    <FaHeadset className="text-gray-500 mr-2" />*/}
                                    {/*    <span>Phone: </span>*/}
                                    {/*    <a href="tel:+15551234567" className="text-blue-600 hover:underline ml-1 dark:text-blue-400">*/}
                                    {/*        (555) 123-4567*/}
                                    {/*    </a>*/}
                                    {/*    <span className="text-gray-500 text-sm ml-2">(Mon-Fri, 9am-5pm EST)</span>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportAndHelp;