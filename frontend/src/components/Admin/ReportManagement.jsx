import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaPaperclip, FaCheck, FaTimes, FaSpinner, FaExpand, FaTimesCircle } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import axios from 'axios';
import { useSelector, shallowEqual } from 'react-redux';

// Image Modal Component
const ImageModal = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
      <button 
        onClick={onClose}
        className="absolute -top-10 right-0 text-neutral-50 hover:text-neutral-300 focus:outline-none"
        aria-label="Close"
      >
        <FaTimesCircle size={24} />
      </button>
      <img 
        src={imageUrl} 
        alt="Full size" 
        className="max-w-full max-h-[80vh] mx-auto object-contain"
      />
    </div>
  </div>
);

const ReportManagement = () => {
    const theme = useSelector((state) => state.theme?.theme || 'light', shallowEqual);
    const [reports, setReports] = useState([]);

    // Add dark mode class to the body when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newNote, setNewNote] = useState('');
    const [status, setStatus] = useState('Submitted');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState({});
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteContent, setEditingNoteContent] = useState('');

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
    const filteredReports = reports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (report.referenceNumber && report.referenceNumber.toLowerCase().includes(searchLower)) ||
            (report._id && report._id.toLowerCase().includes(searchLower)) ||
            (report.customerName && report.customerName.toLowerCase().includes(searchLower)) ||
            (report.email && report.email.toLowerCase().includes(searchLower)) ||
            (report.problemType && report.problemType.toLowerCase().includes(searchLower)) ||
            (report.status && report.status.toLowerCase().includes(searchLower))
        );
    });

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
            'Archived': 'bg-neutral-100 text-neutral-800 border-neutral-200',
            'default': 'bg-neutral-100 text-neutral-800 border-neutral-200'
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
            'Archived': 'bg-neutral-50 border-neutral-200',
            'default': 'bg-neutral-50 border-neutral-200'
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

    const handleEditNote = (note) => {
        setEditingNoteId(note._id);
        setEditingNoteContent(note.content);
    };

    const handleUpdateNote = async (reportId, noteId) => {
        if (!editingNoteContent.trim()) {
            toast.error('Note cannot be empty');
            return;
        }

        try {
            const { data: updatedReport } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/reports/${reportId}/notes/${noteId}`,
                {
                    content: editingNoteContent.trim(),
                    isEdited: true
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
                r._id === reportId ? updatedReport : r
            );

            setReports(updatedReports);
            setSelectedReport(updatedReport);
            setEditingNoteId(null);
            setEditingNoteContent('');

            toast.success('Note updated successfully');
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error(error.response?.data?.message || 'Failed to update note');
        }
    };

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
                        <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-neutral-300" />
                            </div>
                            <input
                                type="text"
                                className="bg-neutral-50 dark:bg-neutral-800 text-neutral-900 text-sm rounded-lg block w-80 pl-10 p-2.5"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                            <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                                    Report ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-neutral-50 dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr
                                        key={report._id}
                                        className="hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                                        onClick={() => handleReportClick(report)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            {report.referenceNumber || `#${report._id.substring(0, 8)}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-neutral-900 dark:text-neutral-100">{report.customerName || 'N/A'}</div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">{report.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
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

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow overflow-hidden transition-colors duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{selectedReport.referenceNumber || 'N/A'}</h2>
                                    <span className="ml-4">{getStatusBadge(selectedReport.status)}</span>
                                    {/*<div className="mt-1">*/}
                                    {/*    {getStatusBadge(selectedReport.status)}*/}
                                    {/*</div>*/}
                                </div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Submitted on {new Date(selectedReport.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Order ID: {selectedReport.orderId?._id || 'N/A'}</h2>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">Customer</h3>
                                <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                                    <p className="font-medium">
                                        {selectedReport.orderId?.shippingAddress?.name ||
                                            selectedReport.customerName ||
                                            'N/A'}
                                    </p>
                                    <p className="text-neutral-600 dark:text-neutral-300">{selectedReport.email || ''}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">What's the problem?</h3>
                                <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg text-neutral-900 dark:text-neutral-50">
                                    {selectedReport.problemType || 'No problem type specified'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">What went wrong?</h3>
                                <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg neutral-50space-pre-line mb-4 text-neutral-900 dark:text-neutral-50">
                                    {selectedReport.details || 'No details provided'}
                                </div>

                                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Attachments ({selectedReport.attachments.length})</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {selectedReport.attachments.map((attachment, index) => {
                                                const imageUrl = attachment.path.startsWith('http')
                                                    ? attachment.path
                                                    : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/reports/${attachment.path}`;
                                                
                                                return (
                                                    <div key={index} className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                                        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-600 rounded-lg overflow-hidden">
                                                            {imageLoading[attachment.path] ? (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <FaSpinner className="animate-spin text-neutral-400 dark:text-neutral-500" />
                                                                </div>
                                                            ) : null}
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Attachment ${index + 1}`}
                                                                className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading[attachment.path] ? 'opacity-0' : 'opacity-100'}`}
                                                                onLoad={() => setImageLoading(prev => ({ ...prev, [attachment.path]: false }))}
                                                                onError={() => setImageLoading(prev => ({ ...prev, [attachment.path]: false }))}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedImage(imageUrl);
                                                                    }}
                                                                    className="p-2 bg-neutral-50 bg-opacity-80 rounded-full text-neutral-700 hover:bg-opacity-100 transition-all"
                                                                    aria-label="View full size"
                                                                >
                                                                    <FaExpand size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                                            {attachment.filename || `image_${index + 1}.jpg`}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Image Modal */}
                                {selectedImage && (
                                    <ImageModal 
                                        imageUrl={selectedImage} 
                                        onClose={() => setSelectedImage(null)} 
                                    />
                                )}
                            </div>

                            {/* Status Dropdown */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">Status</h3>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="dark:bg-neutral-700 bg-neutral-50 text-neutral-900 dark:text-neutral-50 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-transparent"
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
                                    <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-50">Admin Notes</h3>
                                    <div className="space-y-4">
                                        {selectedReport.adminNotes.map((note, index) => {
                                            const statusClass = getStatusClasses(note.status || 'Submitted');
                                            const isEditing = editingNoteId === note._id;

                                            return (
                                                <div key={note._id || index} className={`p-4 rounded-lg border ${statusClass} bg-opacity-20`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium text-neutral-900 dark:text-neutral-50">{note.adminName || 'Admin'}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                    {new Date(note.timestamp).toLocaleString()}
                                                                    {note.editedAt && ` (Edited: ${new Date(note.editedAt).toLocaleString()})`}
                                                                </span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                                                                    {note.status || 'Submitted'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {!isEditing && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditNote(note);
                                                                    }}
                                                                    className="text-neutral-500 hover:text-blue-500 transition-colors"
                                                                    title="Edit note"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteNote(note._id || index);
                                                                }}
                                                                className="text-neutral-500 hover:text-red-500 transition-colors"
                                                                title="Delete note"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {isEditing ? (
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={editingNoteContent}
                                                                onChange={(e) => setEditingNoteContent(e.target.value)}
                                                                className="w-full p-2 border rounded-md mb-4 bg-neutral-50 dark:bg-neutral-600 border-neutral-300 dark:border-neutral-500 text-neutral-900 dark:text-neutral-50"
                                                                rows="3"
                                                            />
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingNoteId(null);
                                                                        setEditingNoteContent('');
                                                                    }}
                                                                    className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateNote(selectedReport._id, note._id || index)}
                                                                    className="px-3 py-1 text-sm bg-blue-600 text-neutral-50 rounded hover:bg-blue-700"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="neutral-50space-pre-line text-neutral-900 dark:text-neutral-50">{note.content}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add New Note */}
                            <div className="mb-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                                    Add Admin Note
                                </label>
                                <textarea
                                    id="notes"
                                    rows="4"
                                    className="block p-2.5 w-full text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-700 rounded-lg focus:outline-none focus:border-transparent"
                                    placeholder="Add your notes here..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleBackToList}
                                    className="px-5 py-3 rounded-full shadow-sm text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-300 focus:outline-none"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isSubmitting || (status === selectedReport.status && !newNote.trim())}
                                    className={`cursor-pointer px-5 py-3 rounded-full shadow-sm text-sm font-normal text-neutral-50 ${
                                        isSubmitting ? 'bg-accent' : 'bg-black hover:bg-neutral-900'
                                    } focus:outline-none`}
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