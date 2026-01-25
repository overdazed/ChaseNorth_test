import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFileAlt, FaExclamationTriangle, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const UserReports = () => {
    const { user } = useSelector((state) => state.auth);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                const response = await fetch(`${API_URL}/api/reports/user/${user.email}`, {
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch reports');
                }

                const data = await response.json();
                // Make sure data is an array before setting it
                setReports(Array.isArray(data) ? data : []);
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
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                {report.problemType || 'Report'} - {report._id.substring(0, 8)}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                                  report.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                                                  report.status === 'Needs Info' ? 'bg-yellow-100 text-yellow-800' :
                                                  report.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {report.status || 'Submitted'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {report.details ? 
                                                    (report.details.length > 100 ? 
                                                        `${report.details.substring(0, 100)}...` : 
                                                        report.details) : 
                                                    'No details provided'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Created on{' '}
                                                <time dateTime={report.createdAt}>
                                                    {format(new Date(report.createdAt), 'MMM d, yyyy')}
                                                </time>
                                            </p>
                                        </div>
                                    </div>
                                    {report.orderId && (
                                        <div className="mt-2">
                                            <span className="text-xs text-gray-500">
                                                Order: {report.orderId.orderNumber || report.orderId._id || 'N/A'}
                                            </span>
                                        </div>
                                    )}
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
