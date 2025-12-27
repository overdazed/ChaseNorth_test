import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {useLocation, useNavigate} from "react-router-dom";

const BugReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const location = useLocation();
  const previousPageUrl = location.state?.from || document.referrer || '/';
  const navigate = useNavigate();
  
  // Extract the path from the URL if it's a full URL
  const getPathFromUrl = (url) => {
    if (!url) return '/';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (e) {
      return url.startsWith('/') ? url : `/${url}`;
    }
  };
  
  const previousPath = getPathFromUrl(previousPageUrl);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error('You can upload up to 5 files');
      return;
    }

    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newFiles.map(f => f.preview)]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('email', data.email);
    // formData.append('pageUrl', document.referrer || 'Direct access or unknown referrer');
    formData.append('pageUrl', previousPageUrl);

    // Add files if any
    selectedFiles.forEach((fileObj) => {
      formData.append('attachments', fileObj.file);
    });

    try {
      const response = await fetch(`${API_URL}/api/bug-report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit bug report');
      }

      // Navigate to confirmation page with the return path
      navigate('/bug-report/confirmation', {
        state: { from: previousPath },
        replace: true
      });

    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast.error(error.message || 'Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow rounded-lg p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50 mb-2">Report a Bug</h1>
            <p className="mb-6 text-neutral-600 dark:text-neutral-300">
              Found an issue? Please let us know what went wrong and we'll look into it.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Email <span className="text-red-800">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email', { required: 'Email is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.email ? 'border-red-800' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject <span className="text-red-800">*</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    {...register('subject', { required: 'Subject is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.subject ? 'border-red-800' : 'border-gray-300'
                    }`}
                    placeholder="Briefly describe the issue"
                />
                {errors.subject && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-800">*</span>
                </label>
                <textarea
                    id="description"
                    rows={6}
                    {...register('description', { required: 'Description is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.description ? 'border-red-800' : 'border-gray-300'
                    }`}
                    placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
                  Screenshots (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white dark:bg-neutral-700 py-2 px-3 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                    Choose Files
                    <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {selectedFiles.length} file(s) selected
              </span>
                </div>
                {previewUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                                src={url}
                                alt={`Screenshot ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                      ))}
                    </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default BugReport;
