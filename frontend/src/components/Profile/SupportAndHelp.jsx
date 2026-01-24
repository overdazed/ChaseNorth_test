import { useState } from 'react';
import { FaQuestionCircle, FaTicketAlt, FaHeadset, FaExternalLinkAlt } from 'react-icons/fa';

const SupportAndHelp = () => {
    const [tickets, setTickets] = useState([
        {
            id: 1,
            title: 'Order #12345 not delivered',
            status: 'Open',
            date: '2023-10-15',
            priority: 'High'
        },
        {
            id: 2,
            title: 'Payment issue with Order #12346',
            status: 'In Progress',
            date: '2023-10-14',
            priority: 'Medium'
        },
        {
            id: 3,
            title: 'Product defect reported',
            status: 'Resolved',
            date: '2023-10-10',
            priority: 'Low'
        }
    ]);

    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Medium'
    });

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
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
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

            {/* Recent Support Tickets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FaTicketAlt className="mr-2 text-yellow-500" />
                        Recent Support Tickets
                    </h3>
                    <button
                        onClick={() => setShowContactForm(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        <FaTicketAlt className="mr-1" />
                        Create New Ticket
                    </button>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 italic">No support tickets found</p>
                        <button
                            onClick={() => setShowContactForm(true)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Ticket
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Ticket #{ticket.id} • {new Date(ticket.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} title={ticket.priority}></span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="text-xs text-blue-600 hover:text-blue-800">View Details</button>
                                    <button className="text-xs text-gray-500 hover:text-gray-700">Update</button>
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