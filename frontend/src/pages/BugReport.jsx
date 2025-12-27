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

    // Log form data before sending
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Add files if any
    selectedFiles.forEach((fileObj, index) => {
      console.log(`Adding file ${index}:`, fileObj.file.name, fileObj.file.type, fileObj.file.size);
      formData.append('attachments', fileObj.file);
    });

    try {
      const response = await fetch(`${API_URL}/api/bug-report`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

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
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-neutral-800 dark:text-neutral-50 ${
                        errors.email ? 'border-red-800' : 'border-neutral-300'
                    }`}
                    placeholder="your@email.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject <span className="text-red-800">*</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    {...register('subject', { required: 'Subject is required' })}
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-neutral-800 dark:text-neutral-50 ${
                        errors.subject ? 'border-red-800' : 'border-neutral-300'
                    }`}
                    placeholder="Briefly describe the issue"
                />
                {errors.subject && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description <span className="text-red-800">*</span>
                </label>
                <textarea
                    id="description"
                    rows={6}
                    {...register('description', { required: 'Description is required' })}
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-neutral-800 dark:text-neutral-50 ${
                        errors.description ? 'border-red-800' : 'border-neutral-300'
                    }`}
                    placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Screenshots (Optional)
                </label>
                <div className="mt-1 flex flex-col space-y-4">
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-4 w-full hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-8 w-8 text-neutral-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                          <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <div className="flex text-sm text-neutral-600 dark:text-neutral-400 justify-center">
                          <span className="relative cursor-pointer rounded-md font-medium text-red-800 hover:text-accent focus-within:outline-none">
                            <span>Upload files</span>
                            <input
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                            />
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {previewUrls.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Selected Files ({previewUrls.length}/5)
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                          {previewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                  <img
                                      src={url}
                                      alt={`Preview ${index + 1}`}
                                      className="h-full w-full object-cover"
                                  />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-neutral-50 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                  ×
                                </button>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex-1 h-12 flex items-center justify-center py-3 rounded-full text-sm font-slim text-neutral-50 transition-colors duration-200 bg-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
