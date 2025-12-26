// src/components/Admin/ReportManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fetchReports, updateReportStatus } from "../../redux/slices/adminSlice.js";
import { BiTrash } from "react-icons/bi";
import { FiRefreshCw } from "react-icons/fi";

const ReportManagement = () => {
    const { theme } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { reports, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "admin") {
            loadReports();
        }
    }, [dispatch, user]);

    const loadReports = () => {
        dispatch(fetchReports());
    };

    const handleStatusChange = (reportId, newStatus) => {
        dispatch(updateReportStatus({ id: reportId, status: newStatus }));
    };

    const inputClasses = `w-full p-2 rounded-md ${
        theme === 'dark'
            ? 'bg-neutral-800 text-neutral-50'
            : 'bg-neutral-100'
    } focus:ring-2 focus:ring-accent focus:border-accent`;

    const statusColors = {
        'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        'In Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        'Needs Info': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    if (loading && !reports?.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Report Management</h2>
                <button
                    onClick={loadReports}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors"
                >
                    <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-neutral-300 font-bold text-left text-xs text-neutral-800 uppercase">
                    <tr>
                        <th className="px-4 py-3">Reference</th>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Problem Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports?.map((report) => (
                        <tr
                            key={report._id}
                            className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 hover:dark:bg-accent"
                        >
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className="font-mono">{report.referenceNumber}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                {report.orderId?.orderNumber || report.orderId?._id || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                {report.problemType}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <select
                                    value={report.status}
                                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                                    className={`px-2 py-1 rounded text-sm ${
                                        statusColors[report.status] || 'bg-gray-100'
                                    } ${theme === 'dark' ? 'bg-opacity-20' : ''}`}
                                >
                                    {Object.keys(statusColors).map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                            className={theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => navigate(`/admin/reports/${report._id}`)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                    >
                                        View
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportManagement;