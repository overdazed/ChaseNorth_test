import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFileAlt, FaExclamationTriangle, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';
import { format } from "date-fns/format";
import { useNavigate, Link } from 'react-router-dom';

const UserReports = () => {
    const { user } = useSelector((state) => state.auth);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                console.log('Fetching reports for:', user.email);
                const response = await fetch(`${API_URL}/api/reports/user/${user.email}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();
                console.log('API Response:', data);
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch reports');
                }

                // Handle both response formats
                const reportsData = data.reports || data;
                if (!Array.isArray(reportsData)) {
                    throw new Error('Unexpected response format: expected an array of reports');
                }
                
                console.log('Setting reports:', reportsData);
                setReports(reportsData);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, [user.email, API_URL]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved':
                return <FaCheckCircle className="text-green-500 mr-2" />;
            case 'In Review':
                return <FaClock className="text-blue-500 mr-2" />;
            case 'Needs Info':
                return <FaInfoCircle className="text-yellow-500 mr-2" />;
            case 'Rejected':
                return <FaExclamationTriangle className="text-red-500 mr-2" />;
            default:
                return <FaFileAlt className="text-gray-500 mr-2" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Reports</h2>
                <button
                    onClick={() => navigate('/report')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    New Report
                </button>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="mt-1 text-gray-500">You haven't submitted any reports yet.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/report')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Create Your First Report
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <li key={report._id} className="hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {getStatusIcon(report.status)}
                                            <div className="flex flex-col">
                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                {report.problemType || 'Report'}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                    {report.referenceNumber || `#${report._id?.substring(0, 8) || 'N/A'}`}
                                                </span>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-3 py-1 rounded-full text-xs font-medium 
                                                ${report.status === 'Resolved' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                                                    : report.status === 'In Review' 
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                                        : report.status === 'Needs Info' 
                                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                                                            : report.status === 'Archived'
                                                                ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                                                : report.status === 'Rejected' 
                                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' // Default for 'Submitted'
                                                }`}>
                                                {report.status || 'Submitted'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {report.details ? 
                                                (report.details.length > 100 ? 
                                                    `${report.details.substring(0, 100)}...` : 
                                                    report.details) : 
                                                'No details provided'}
                                        </p>
                                    </div>
                                    {/* Admin Notes Section - Only show for 'Needs Info' status */}
                                    {report.status === 'Needs Info' && report.adminNotes && report.adminNotes.length > 0 && (
                                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r">
                                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Action needed! 
                                                <span className="block mt-1 text-yellow-700 dark:text-yellow-300 font-normal">
                                                    &gt; {report.adminNotes[report.adminNotes.length - 1].content}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="mt-2 flex flex-wrap items-center gap-x-6 text-sm text-gray-500 dark:text-gray-400">
                                        {report.orderId && (
                                            <div className="flex items-center">
                                                <span className="font-medium">Order:</span>
                                                <span className="ml-1">
                                                    {report.orderId.orderNumber || report.orderId._id || 'N/A'}
                                                </span>
                                                <Link 
                                                    to={`/order/${report.orderId._id || report.orderId}`}
                                                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                                >
                                                    (View Details)
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <span className="font-medium">Created on</span>
                                            <time dateTime={report.createdAt} className="ml-1">
                                                {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserReports;
