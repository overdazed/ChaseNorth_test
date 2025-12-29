import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const problemTypes = [
  'Item not delivered',
  'Delivered late',
  'Wrong item',
  'Damaged item',
  'Missing item',
  'Quality not as described',
  'Other'
];

const desiredOutcomes = [
  'Refund',
  'Replacement',
  'Partial refund',
  'Just reporting the issue'
];

const API_URL = import.meta.env.VITE_API_URL

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProblemType, setSelectedProblemType] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log('Fetching order details for order ID:', location.state?.orderId);
      if (!location.state?.orderId) {
        console.error('No order ID found');
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/api/orders/${location.state.orderId}`);
        console.log('Order API response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        if (response.ok) {
          const data = await response.json();
          console.log('Order data received:', data);
          const items = data.orderItems || [];
          console.log('Order items:', items);
          setOrderItems(items);
          if (items.length > 0) {
            console.log('Setting selected product to first item:', items[0]._id);
            setSelectedProduct(items[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    if (location.state?.orderId) {
      fetchOrderDetails();
    }
  }, [location.state?.orderId]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      problemType: '',
      otherProblem: '',
      details: '',
      desiredOutcome: '',
      email: localStorage.getItem('userEmail') || ''
    }
  });
  
  const problemType = watch('problemType');

  // Get order details from location state or query params
  const orderDetails = {
    orderNumber: location.state?.orderId || 'N/A',
    deliveryDate: location.state?.deliveryDate || new Date().toISOString().split('T')[0],
    sellerName: location.state?.sellerName || 'Adventure Store',
    shippingAddress: location.state?.shippingAddress || null
  };

  // Debug log to check what's in location.state
  useEffect(() => {
    console.log('Location state:', location.state);
  }, [location.state]);

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

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Add form data
    formData.append('orderId', orderDetails.orderNumber);
    formData.append('problemType', data.otherProblem ? `Other: ${data.otherProblem}` : data.problemType);
    formData.append('details', data.details);
    formData.append('desiredOutcome', data.desiredOutcome);
    formData.append('email', data.email);

    // Add files if any
    selectedFiles.forEach((fileObj, index) => {
      formData.append('attachments', fileObj.file);
    });

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        body: formData,
        // No Authorization header needed
      });

      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit report');
      }

      // Show success message
      toast.success('Report submitted successfully!');

      navigate('/report/confirmation', {
        state: {
          referenceNumber: responseData.data?.referenceNumber || `REF-${Date.now()}`, // Fallback to timestamp if not available
          email: data.email
        }
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Report a problem with your order
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8">
          We'll review your report and get back to you within 24 hours.
        </p>

        {/* Order Context */}
        <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mb-8">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-3">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Order ID</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">{orderDetails.orderNumber}</p>
            </div>
            {/* Product selection temporarily disabled
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Product
              </label>
              <select
                id="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-50"
              >
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <option key={item._id || item.productId} value={item._id || item.productId}>
                      {item.name || `Product ${item.productId}`} {item.quantity ? `(Qty: ${item.quantity})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="">No products found</option>
                )}
              </select>
              <div className="text-xs text-neutral-500 mt-1">
                {orderItems.length} product(s) found for this order
              </div>
            </div>
            */}
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Delivery Date</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                {new Date(orderDetails.deliveryDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Shipping Address</p>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">
                {orderDetails.shippingAddress ? (
                  <>
                    {orderDetails.shippingAddress.address && <div>{orderDetails.shippingAddress.address}</div>}
                    {(orderDetails.shippingAddress.city || orderDetails.shippingAddress.postalCode) && (
                      <div>
                        {orderDetails.shippingAddress.postalCode} {orderDetails.shippingAddress.city}
                      </div>
                    )}
                    {orderDetails.shippingAddress.country && <div>{orderDetails.shippingAddress.country}</div>}
                  </>
                ) : (
                  'No shipping address available'
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Problem Type */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-3">What's the problem?</h2>
            <div className="space-y-2">
              {problemTypes.map((type) => (
                <div key={type} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={type}
                      type="radio"
                      value={type}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      {...register('problemType', { 
                        required: 'Please select a problem type',
                        onChange: (e) => setSelectedProblemType(e.target.value)
                      })}
                    />
                  </div>
                  <label htmlFor={type} className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {type}
                  </label>
                </div>
              ))}
              {problemType === 'Other' && (
                <div className="mt-2 ml-7">
                  <input
                    type="text"
                    className="mt-1 block w-1/3 rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-50 py-2 px-3 h-10"
                    placeholder="Please specify the problem"
                    style={{ minHeight: '2rem' }}
                    {...register('otherProblem', { 
                      required: problemType === 'Other' ? 'Please specify the problem' : false
                    })}
                  />
                  {errors.otherProblem && (
                    <p className="mt-1 text-sm text-red-700">{errors.otherProblem.message}</p>
                  )}
                </div>
              )}
              {errors.problemType && (
                <p className="mt-1 text-sm text-red-700">{errors.problemType.message}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              What went wrong? Include dates or photos if relevant.
            </label>
            <div className="mt-1">
              <textarea
                  id="details"
                  rows={4}
                  className="pt-3 pl-3 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 dark:border-neutral-600 rounded-md dark:bg-neutral-800 dark:text-neutral-50"
                  placeholder="Provide details about the issue..."
                  style={{ textAlign: 'left' }}
                  {...register('details', {
                    required: 'Please provide details about the issue',
                    minLength: {
                      value: 10,
                      message: 'Please provide more details (at least 10 characters)'
                    }
                  })}
              />
              {errors.details && (
                <p className="mt-1 text-sm text-red-700">{errors.details.message}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Add photos or documents (optional, up to 5 files)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                    className="mx-auto h-8 w-8 text-neutral-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                  <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span className="text-red-800" >Upload files</span>
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
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
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
                      <div className="h-24 w-24 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                        {preview.startsWith('blob:') ? (
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-neutral-500">PDF</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-neutral-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-3">What would you like to happen?</h2>
            <div className="space-y-2">
              {desiredOutcomes.map((outcome) => (
                <div key={outcome} className="flex items-center">
                  <input
                    id={`outcome-${outcome}`}
                    type="radio"
                    value={outcome}
                    {...register('desiredOutcome', { required: 'Please select a desired outcome' })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600"
                  />
                  <label
                    htmlFor={`outcome-${outcome}`}
                    className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {outcome}
                  </label>
                </div>
              ))}
              {errors.desiredOutcome && (
                <p className="mt-1 text-sm text-red-700">{errors.desiredOutcome.message}</p>
              )}
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Contact email
            </label>
            <div className="mt-1">


              <input
                type="text"
                id="email"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-1/3 sm:text-sm border-neutral-300 dark:border-neutral-600 rounded-md dark:bg-neutral-800 dark:text-neutral-50 py-2 px-3 h-10"
                placeholder="your@email.com"
                style={{ minHeight: '2rem' }}
                title="Please enter a valid email address (e.g. yourname@example.com)"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className=" w-full flex-1 h-12 flex items-center justify-center py-3 rounded-full text-sm font-slim text-neutral-50 transition-colors duration-200 bg-black hover:bg-neutral-800  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Send report'}
            </button>
            {/*<p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">*/}
            {/*  You'll receive a confirmation email shortly.*/}
            {/*</p>*/}
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
