// src/components/Admin/ReportManagement.jsx
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/admin/reports');
                if (!response.ok) {
                    throw new Error('Failed to fetch reports');
                }
                const data = await response.json();
                setReports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const toggleReportStatus = async (reportId, currentStatus) => {
        try {
            const response = await fetch(`/api/admin/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update report status');
            }

            setReports(reports.map(report =>
                report.id === reportId
                    ? { ...report, isActive: !currentStatus }
                    : report
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-2xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Reports Management</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Report Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {report.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {report.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${report.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                                        {report.isActive ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => toggleReportStatus(report.id, report.isActive)}
                                    className={`mr-2 px-3 py-1 rounded-md text-sm font-medium ${
                                        report.isActive
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600'
                                    }`}
                                >
                                    {report.isActive ? <FaTimes /> : <FaCheck />}
                                </button>
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