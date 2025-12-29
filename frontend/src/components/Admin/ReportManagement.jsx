import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaPaperclip, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newNote, setNewNote] = useState('');
    const [status, setStatus] = useState('Submitted');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);

    // Fetch all reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('userToken');
                const response = await axios.get('http://localhost:9000/api/admin/reports', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setReports(response.data.reports || []);

                // If there's an ID in the URL, select that report
                if (id) {
                    const report = response.data.reports.find(r => r._id === id);
                    if (report) {
                        setSelectedReport(report);
                        setStatus(report.status);
                        setNewNote(''); // Changed from setNote to setNewNote
                    }
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [id]);

    // Filter reports based on search term
    const filteredReports = reports.filter(report => 
        report._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setStatus(report.status);
        setNewNote(''); // Changed from setNote to setNewNote
        navigate(`/admin/reports/${report._id}`);
    };

    const handleBackToList = () => {
        setSelectedReport(null);
        navigate('/admin/reports');
    };

    const handleStatusUpdate = async () => {
        if (!selectedReport) return;

        try {
            setIsSubmitting(true);

            const { data: updatedReport } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/reports/${selectedReport._id}`,
                {
                    status,
                    note: newNote.trim() || undefined,
                    noteStatus: status // Include the status with the note
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            const updatedReports = reports.map(r =>
                r._id === selectedReport._id ? updatedReport : r
            );

            setReports(updatedReports);
            setSelectedReport(updatedReport);
            setNewNote('');

            toast.success('Report updated successfully');
        } catch (error) {
            console.error('Error updating report:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            }
            toast.error(error.response?.data?.message || 'Failed to update report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusClasses = (status) => {
        const statusClasses = {
            'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
            'In Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Needs Info': 'bg-purple-100 text-purple-800 border-purple-200',
            'Rejected': 'bg-red-100 text-red-800 border-red-200',
            'Resolved': 'bg-green-100 text-green-800 border-green-200',
            'Archived': 'bg-gray-100 text-gray-800 border-gray-200',
            'default': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return statusClasses[status] || statusClasses['default'];
    };

    const getStatusBadge = (status) => {
        return (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClasses(status)}`}>
            {status}
        </span>
        );
    };

    const getStatusColorClass = (status) => {
        const statusClasses = {
            'Submitted': 'bg-blue-50 border-blue-200',
            'In Review': 'bg-yellow-50 border-yellow-200',
            'Needs Info': 'bg-purple-50 border-purple-200',
            'Rejected': 'bg-red-50 border-red-200',
            'Resolved': 'bg-green-50 border-green-200',
            'Archived': 'bg-gray-50 border-gray-200',
            'default': 'bg-gray-50 border-gray-200'
        };
        return statusClasses[status] || statusClasses['default'];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
                <span className="ml-2">Loading reports...</span>
            </div>
        );
    }

    const handleDeleteNote = async (noteId) => {
        if (!selectedReport || !window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const { data: updatedReport } = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/reports/${selectedReport._id}/notes/${noteId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    },
                    withCredentials: true
                }
            );

            // Update the local state
            const updatedReports = reports.map(r =>
                r._id === selectedReport._id ? updatedReport : r
            );

            setReports(updatedReports);
            setSelectedReport(updatedReport);

            toast.success('Note deleted successfully');
        } catch (error) {
            console.error('Error deleting note:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            }
            toast.error(error.response?.data?.message || 'Failed to delete note');
        }
    };

    return (
        <div className="p-6">
            {!selectedReport ? (
                // Reports List View
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Reports</h1>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Report ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr 
                                            key={report._id} 
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleReportClick(report)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {report.referenceNumber || `#${report._id.substring(0, 8)}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{report.customerName || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{report.email || ''}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(report.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No reports found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Single Report View
                <div>
                    <button
                        onClick={handleBackToList}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Reports
                    </button>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">Report #{selectedReport._id.substring(0, 8)}</h2>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedReport.status)}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Submitted on {new Date(selectedReport.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Customer</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">{selectedReport.customerName || 'N/A'}</p>
                                    <p className="text-gray-600">{selectedReport.email || ''}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">What's the problem?</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {selectedReport.problemType || 'No problem type specified'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">What went wrong? Include dates or photos if relevant.</h3>
                                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line mb-4">
                                    {selectedReport.details || 'No details provided'}
                                </div>

                                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-4">
                                            {selectedReport.attachments.map((attachment, index) => (
                                                <div key={index} className="border rounded-lg overflow-hidden">
                                                    <img
                                                        src={attachment.path}
                                                        alt={`Attachment ${index + 1}`}
                                                        className="h-48 object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Dropdown */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Status</h3>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                    <option value="Submitted">Submitted</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Needs Info">Needs Info</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            {/* Admin Notes */}
                            {selectedReport.adminNotes?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">Admin Notes</h3>
                                    <div className="space-y-4">
                                        {selectedReport.adminNotes.map((note, index) => {
                                            const statusClass = getStatusClasses(note.status || 'Submitted');
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border ${statusClass} bg-opacity-20`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium">{note.adminName || 'Admin'}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                        {new Date(note.timestamp).toLocaleString()}
                                    </span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                                        {note.status || 'Submitted'}
                                    </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteNote(note._id || index);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Delete note"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                    <p className="whitespace-pre-line text-gray-800 mt-2">{note.content}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add New Note */}
                            <div className="mb-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Add Admin Note
                                </label>
                                <textarea
                                    id="notes"
                                    rows="4"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add your notes here..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleBackToList}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isSubmitting || (status === selectedReport.status && !newNote.trim())}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Updating...
                                    </span>
                                    ) : (
                                        'Update Status'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;