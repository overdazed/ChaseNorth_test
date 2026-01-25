import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaTicketAlt, FaHeadset, FaExternalLinkAlt, FaImage, FaFileAlt, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SupportAndHelp = ({ showOnlyFaq = false }) => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState(showOnlyFaq ? 'faq' : 'faq');
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Medium'
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, this would submit to your support system
        alert('Support request submitted successfully!');
        setShowContactForm(false);
        setFormData({ subject: '', message: '', priority: 'Medium' });
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
    
    // FAQ data
    const faqData = [
        {
            question: 'How do I track my order?',
            answer: 'You can track your order by visiting the My Orders section in your profile.',
            additionalInfo: 'Orders typically ship within 1-2 business days.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. Items must be in original condition with all tags attached.'
        },
        {
            question: 'How do I contact customer support?',
            answer: 'You can contact our support team through the contact form below or by emailing support@example.com.'
        }
    ];

    return (
        <div className={`p-6 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'} rounded-lg shadow-sm`}>
            <div className="flex flex-col">
                {!showOnlyFaq && (
                    <div className="w-full mb-6">
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                            <h2 className="text-xl font-bold mb-4">Support Center</h2>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('faq')}
                                    className={`px-4 py-2 rounded-md ${
                                        activeTab === 'faq' 
                                            ? 'bg-blue-600 text-white' 
                                            : isDarkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    FAQ
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className={`px-4 py-2 rounded-md ${
                                        activeTab === 'reports' 
                                            ? 'bg-blue-600 text-white' 
                                            : isDarkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Your Reports
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="w-full">
                    {(activeTab === 'faq' || showOnlyFaq) ? (
                        <div className="space-y-6">
                            {!showOnlyFaq && <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>}
                            
                            <div className="space-y-6">
                                {faqData.map((faq, index) => (
                                    <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                                        <h3 className="text-lg font-medium text-blue-600">{faq.question}</h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                        {faq.additionalInfo && (
                                            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                                <p className="text-sm text-blue-700 dark:text-blue-300">{faq.additionalInfo}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
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

                {/* Contact Form */}
                {showContactForm && (
                    <div className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Contact Support</h3>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                    required
                                    placeholder="Briefly describe your issue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows="4"
                                    required
                                    placeholder="Provide details about your issue..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowContactForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportAndHelp;