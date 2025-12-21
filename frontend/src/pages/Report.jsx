import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

const problemTypes = [
  'Item not delivered',
  'Delivered late',
  'Wrong item',
  'Damaged item',
  'Missing parts',
  'Quality not as described',
  'Other'
];

const desiredOutcomes = [
  'Refund',
  'Replacement',
  'Partial refund',
  'Just reporting the issue'
];

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrderDetails(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
      setError('No order ID provided');
    }
  }, [orderId]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      problemType: '',
      details: '',
      desiredOutcome: '',
      email: localStorage.getItem('userEmail') || ''
    }
  });

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('problemType', data.problemType);
      formData.append('details', data.details);
      formData.append('desiredOutcome', data.desiredOutcome);
      formData.append('email', data.email);

      selectedFiles.forEach((fileObj, index) => {
        formData.append('attachments', fileObj.file);
      });

      await axios.post('/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Report submitted successfully!');
      navigate('/report/confirmation', {
        state: {
          referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
          email: data.email
        }
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
                onClick={() => navigate('/my-orders')}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Back to My Orders
            </button>
          </div>
        </div>
    );
  }

  const orderInfo = {
    orderNumber: orderDetails?._id || 'N/A',
    productName: orderDetails?.orderItems?.map(item => item.name).join(', ') || 'N/A',
    orderDate: orderDetails?.createdAt || new Date().toISOString(),
    status: orderDetails?.status || 'Processing',
    sellerName: 'Adventure Store'
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Report a problem with your order
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            We'll review your report and get back to you within 24 hours.
          </p>

          {/* Order Context */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{orderInfo.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Product</p>
                <p className="font-medium text-gray-900 dark:text-white">{orderInfo.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(orderInfo.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white">{orderInfo.status}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rest of your form remains the same */}
            {/* Problem Type */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What's the problem?</h2>
              <div className="space-y-2">
                {problemTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                          id={type}
                          type="radio"
                          value={type}
                          {...register('problemType', { required: 'Please select a problem type' })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor={type} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {type}
                      </label>
                    </div>
                ))}
                {errors.problemType && (
                    <p className="mt-1 text-sm text-red-600">{errors.problemType.message}</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What went wrong? Include dates or photos if relevant.
              </label>
              <div className="mt-1">
              <textarea
                  id="details"
                  rows={4}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Provide details about the issue..."
                  {...register('details')}
              />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add photos or documents (optional, up to 5 files)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                  >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload files</span>
                      <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>

              {/* Preview uploaded files */}
              {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-4">
                      {previewUrls.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                              {preview.startsWith('blob:') ? (
                                  <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="h-full w-full object-cover"
                                  />
                              ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <span className="text-gray-500">PDF</span>
                                  </div>
                              )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove"
                            >
                              <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>

            {/* Desired Outcome */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What would you like to happen?</h2>
              <div className="space-y-2">
                {desiredOutcomes.map((outcome) => (
                    <div key={outcome} className="flex items-center">
                      <input
                          id={`outcome-${outcome}`}
                          type="radio"
                          value={outcome}
                          {...register('desiredOutcome', { required: 'Please select a desired outcome' })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                      />
                      <label
                          htmlFor={`outcome-${outcome}`}
                          className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {outcome}
                      </label>
                    </div>
                ))}
                {errors.desiredOutcome && (
                    <p className="mt-1 text-sm text-red-600">{errors.desiredOutcome.message}</p>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact email
              </label>
              <div className="mt-1">
                <input
                    type="email"
                    id="email"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Send report'}
              </button>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                You'll receive a confirmation email shortly.
              </p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Report;