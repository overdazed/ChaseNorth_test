import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaTicketAlt, FaHeadset, FaExternalLinkAlt, FaImage, FaFileAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const SupportAndHelp = () => {
    const { user } = useSelector((state) => state.auth);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Medium'
    });

    useEffect(() => {
        const fetchUserReports = async () => {
            if (!user || !user.email) {
                setLoading(false);
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/api/reports/user/${user.email}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch reports');
                }

                const data = await response.json();
                setReports(data.reports || []);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to load your reports. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, [user]);

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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Support & Help Center</h2>
            </div>

            {/* Quick Access Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaQuestionCircle className="mr-2 text-blue-500" />
                    Quick Access
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Help Center Link */}
                    <a
                        href="/faq"
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <FaQuestionCircle className="mr-3 text-blue-600" />
                            <div>
                                <h4 className="font-medium text-blue-800">Help Center</h4>
                                <p className="text-sm text-blue-600">FAQs and Guides</p>
                            </div>
                        </div>
                        <FaExternalLinkAlt className="text-blue-400" />
                    </a>

                    {/* Contact Support Button */}
                    <button
                        onClick={() => setShowContactForm(true)}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <FaHeadset className="mr-3 text-green-600" />
                            <div>
                                <h4 className="font-medium text-green-800">Contact Support</h4>
                                <p className="text-sm text-green-600">Get in touch with us</p>
                            </div>
                        </div>
                        <FaExternalLinkAlt className="text-green-400" />
                    </button>

                    {/* Report Bug Link */}
                    <a
                        href="/bug-report"
                        className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <FaQuestionCircle className="mr-3 text-red-600" />
                            <div>
                                <h4 className="font-medium text-red-800">Report Bug</h4>
                                <p className="text-sm text-red-600">Report technical issues</p>
                            </div>
                        </div>
                        <FaExternalLinkAlt className="text-red-400" />
                    </a>
                </div>
            </div>

            {/* User Reports Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FaTicketAlt className="mr-2 text-yellow-500" />
                        Your Reports
                    </h3>
                    <a
                        href="/report"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        <FaTicketAlt className="mr-1" />
                        Create New Report
                    </a>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 italic">Loading your reports...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 italic">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 italic">No reports found</p>
                        <a
                            href="/report"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Report
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report._id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-medium text-gray-900">Report #{report.referenceNumber}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{report.problemType}</p>
                                        <p className="text-sm text-gray-700 mb-3">{report.details}</p>
                                        
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                                            <span>Order: {report.orderId?.orderNumber || 'N/A'}</span>
                                            <span>Created: {formatDate(report.createdAt)}</span>
                                            <span>Updated: {formatDate(report.updatedAt)}</span>
                                        </div>
                                        
                                        {/* Attachments */}
                                        {report.attachments && report.attachments.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Attachments:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {report.attachments.map((attachment, index) => (
                                                        <div key={index} className="flex items-center bg-white border rounded px-2 py-1 text-xs">
                                                            {getFileIcon(attachment.filename)}
                                                            <span className="ml-1 truncate max-w-[150px]">{attachment.filename}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-3">
                                    <a
                                        href={`/report/${report._id}`}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        View Details
                                    </a>
                                    {report.status === 'Submitted' && (
                                        <button className="text-xs text-gray-500 hover:text-gray-700">Edit</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Support Form */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaHeadset className="mr-2 text-green-500" />
                                Contact Support
                            </h3>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="text-xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                </div>
            )}
        </div>
    );
};

export default SupportAndHelp;