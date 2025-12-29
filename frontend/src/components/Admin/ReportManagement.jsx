import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaPaperclip, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch all reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/admin/reports');
                setReports(response.data.reports || []);

                // If there's an ID in the URL, select that report
                if (id) {
                    const report = response.data.reports.find(r => r._id === id);
                    if (report) {
                        setSelectedReport(report);
                        setStatus(report.status);
                        setNote(report.adminNotes || '');
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
        setNote(report.adminNotes || '');
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
            // Update the report status and notes
            await axios.put(`/api/admin/reports/${selectedReport._id}`, {
                status,
                adminNotes: note
            });

            // Update the local state
            const updatedReports = reports.map(r =>
                r._id === selectedReport._id
                    ? { ...r, status, adminNotes: note }
                    : r
            );

            setReports(updatedReports);
            setSelectedReport({ ...selectedReport, status, adminNotes: note });

            toast.success('Report updated successfully');
        } catch (error) {
            console.error('Error updating report:', error);
            toast.error('Failed to update report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            resolved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        
        const statusText = {
            pending: 'Pending',
            in_progress: 'In Progress',
            resolved: 'Resolved',
            rejected: 'Rejected'
        };
        
        return (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusText[status] || status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
                <span className="ml-2">Loading reports...</span>
            </div>
        );
    }

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
                                                {report._id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{report.user?.name || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{report.user?.email || ''}</div>
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
                                    <p className="font-medium">{selectedReport.user?.name || 'N/A'}</p>
                                    <p className="text-gray-600">{selectedReport.user?.email || ''}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Subject</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {selectedReport.subject || 'No subject provided'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Description</h3>
                                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                                    {selectedReport.description || 'No description provided'}
                                </div>
                            </div>

                            {selectedReport.imageUrl && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">Attached Image</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <img 
                                            src={selectedReport.imageUrl} 
                                            alt="Report attachment" 
                                            className="max-h-64 rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Status</h3>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Notes
                                </label>
                                <textarea
                                    id="notes"
                                    rows="4"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add your notes here..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>

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
                                    disabled={isSubmitting || (status === selectedReport.status && note === (selectedReport.adminNotes || ''))}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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