import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logout } from '../../redux/slices/authSlice';
import { FaEdit, FaSave, FaTimes, FaCamera, FaKey, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { countries } from '../../data/countries.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// Custom scrollbar styles
const scrollbarStyles = `
  .country-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .country-scrollbar::-webkit-scrollbar-track {
    background-color: #404040;
    border-radius: 1px;
  }
  .country-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 1px;
  }
  .dark .country-scrollbar::-webkit-scrollbar-track {
    background-color: #202020;
  }
  .dark .country-scrollbar::-webkit-scrollbar-thumb {
    background-color: #404040;
  }
`;

const PersonalInfo = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Debug logs
  console.log('Full auth state:', authState);
  console.log('User from auth state:', authState.user);
  console.log('Is user authenticated?', authState.isAuthenticated);
  
  // Destructure user after logging the full state
  const { user } = authState;

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  // Add scrollbar styles to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  });
  const [emailError, setEmailError] = useState('');

  const [addressData, setAddressData] = useState({
    billingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    shippingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    sameAsBilling: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setAddressData({
        billingAddress: user.billingAddress || {
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        shippingAddress: user.shippingAddress || {
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        sameAsBilling: user.sameAsBilling || false
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sameAsBilling') {
      setAddressData(prev => ({
        ...prev,
        sameAsBilling: checked,
        shippingAddress: checked ? { ...prev.billingAddress } : { ...prev.shippingAddress }
      }));
      return;
    }

    const [addressType, field] = name.split('.');

    setAddressData(prev => {
      const newState = { ...prev };
      if (addressType === 'billing' || addressType === 'shipping') {
        const addressField = `${addressType}Address`;
        newState[addressField] = {
          ...newState[addressField],
          [field]: value
        };

        // If same as billing is checked, update shipping address too
        if (addressType === 'billing' && newState.sameAsBilling) {
          newState.shippingAddress = { ...newState.billingAddress };
        }
      }
      return newState;
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Profile picture should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Debug: Log the profile picture data before submission
  console.log('Profile picture data before submission:', formData.profilePicture);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate that new password and confirm password match
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      // Dispatch the updateUser action with password change data
      const resultAction = await dispatch(updateUser({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }));

      // Check if the update was successful
      if (updateUser.fulfilled.match(resultAction)) {
        // Clear the form and show success message
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordForm(false);
        alert('Password updated successfully!');
      } else {
        // Show error message if update failed
        const error = resultAction.error?.message || 'Failed to update password';
        alert(error);
      }
    } catch (error) {
      console.error('Password update error:', error);
      alert(error.message || 'Failed to update password');
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: value
    }));
    setEmailError('');
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!emailForm.newEmail || !emailForm.currentPassword) {
      setEmailError('Please fill in all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      // Get the token from localStorage - using the correct key 'userToken'
      const token = localStorage.getItem('userToken');
      
      console.log('Update email request details:', {
        currentEmail: user?.email,
        newEmail: emailForm.newEmail,
        tokenExists: !!token,
        apiUrl: API_URL
      });
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('Sending request to update email...');
      const response = await fetch(`${API_URL}/api/users/update-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({
          newEmail: emailForm.newEmail,
          currentPassword: emailForm.currentPassword
        }),
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      // Check for 401 Unauthorized
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Authentication error:', errorData);
        
        // If token is invalid or expired, log the user out
        if (errorData.message?.includes('expired') || 
            errorData.message?.includes('invalid') ||
            response.statusText === 'Unauthorized') {
          dispatch(logout());
          throw new Error('Your session has expired. Please log in again.');
        }
        
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        // If unauthorized, try to refresh the token
        if (response.status === 401) {
          // Attempt to refresh the token
          const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (refreshResponse.ok) {
            const { token: newToken } = await refreshResponse.json();
            // Retry the request with the new token
            const retryResponse = await fetch(`${API_URL}/api/users/update-email`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newToken}`
              },
              body: JSON.stringify({
                newEmail: emailForm.newEmail,
                currentPassword: emailForm.currentPassword
              })
            });
            
            const retryData = await retryResponse.json();
            
            if (!retryResponse.ok) {
              throw new Error(retryData.message || 'Failed to update email after token refresh');
            }
            
            // Update the token in localStorage
            localStorage.setItem('token', newToken);
            
            // Return the successful response data
            return retryData;
          } else {
            // If refresh fails, log the user out
            dispatch(logout());
            throw new Error('Session expired. Please log in again.');
          }
        }
        
        throw new Error(data.message || 'Failed to update email');
      }
      
      // Update user data in the UI with the new token and user data
      dispatch(updateUser({ 
        email: data.user.email,
        token: data.token,
        emailVerified: data.user.emailVerified
      }));
      
      // Reset form and state
      setEmailForm({
        newEmail: '',
        currentPassword: ''
      });
      setIsEditingEmail(false);
      setEmailError('');
      
      toast.success(data.message || 'Email updated successfully! Please verify your new email.');
    } catch (error) {
      console.error('Error updating email:', error);
      setEmailError(error.message || 'Failed to update email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate postal codes before submission
      const postalCodePattern = /^[0-9]{4}[0-9A-Z ]{1,3}$/;

      if (addressData.billingAddress.postalCode && !postalCodePattern.test(addressData.billingAddress.postalCode)) {
        setFormData(prev => ({
          ...prev,
          postalCodeError: 'Billing Address Postal Code must start with exactly 4 digits, followed by 1-3 letters/numbers (5-7 characters total)'
        }));
        return;
      }

      if (addressData.shippingAddress.postalCode && !postalCodePattern.test(addressData.shippingAddress.postalCode)) {
        setFormData(prev => ({
          ...prev,
          postalCodeError: 'Shipping Address Postal Code must start with exactly 4 digits, followed by 1-3 letters/numbers (5-7 characters total)'
        }));
        return;
      }

      const updateData = {
        ...formData,
        ...addressData
      };

      // Don't send password fields in the regular update
      delete updateData.currentPassword;
      delete updateData.newPassword;
      delete updateData.confirmPassword;

      await dispatch(updateUser(updateData)).unwrap();
      setIsEditing(false);
      // Force a reload to ensure the UI reflects the updated profile picture
      window.location.reload();
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const renderAddressForm = (type) => {
    const address = type === 'billing' ? addressData.billingAddress : addressData.shippingAddress;
    const prefix = type === 'billing' ? 'billing' : 'shipping';

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name={`${prefix}.firstName`}
              value={address.firstName || ''}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                handleAddressChange({ target: { name: e.target.name, value: capitalized } });
              }}
              onBlur={(e) => {
                // Capitalize first letter of each word
                const capitalized = e.target.value
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
                handleAddressChange({ target: { name: e.target.name, value: capitalized } });
              }}
              className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent ${
                !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                  ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                  : 'dark:bg-neutral-800 dark:text-white'
              }`}
              disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
              pattern="[A-Za-z\s]+"
              title="Please enter a valid name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name={`${prefix}.lastName`}
              value={address.lastName || ''}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                handleAddressChange({ target: { name: e.target.name, value: capitalized } });
              }}
              className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent ${
                !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                  ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                  : 'dark:bg-neutral-800 dark:text-white'
              }`}
              disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
              pattern="[A-Za-z\s]+"
              title="Please enter a valid last name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street</label>
          <input
            type="text"
            name={`${prefix}.street`}
            value={address.street || ''}
            onChange={(e) => {
                const value = e.target.value;
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                handleAddressChange({ target: { name: e.target.name, value: capitalized } });
              }}
            className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent ${
              !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                : 'dark:bg-neutral-800 dark:text-white'
            }`}
            disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
            pattern="^[A-Za-zßüöäÜÖÄ.\s]+\s\d+.*$"
            title="Address must include a street name followed by a space and number"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name={`${prefix}.city`}
              value={address.city || ''}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                handleAddressChange({ target: { name: e.target.name, value: capitalized } });
              }}
              className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent ${
                !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                  ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                  : 'dark:bg-neutral-800 dark:text-white'
              }`}
              disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
              pattern="^[A-Za-z\s]+" // only allows letters
              title="City name must contain only letters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              type="text"
              name={`${prefix}.postalCode`}
              value={address.postalCode || ''}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Only allow digits in first 4 positions
                if (value.length <= 4) {
                  // Only allow digits for first 4 characters
                  const filteredValue = value.replace(/[^0-9]/g, '');
                  handleAddressChange({ target: { name: e.target.name, value: filteredValue } });
                } else {
                  // Allow digits and letters after first 4 characters
                  const first4 = value.substring(0, 4).replace(/[^0-9]/g, '');
                  const rest = value.substring(4).replace(/[^0-9A-Z ]/g, '');
                  const finalValue = first4 + rest;
                  // Limit to 7 characters total
                  const limitedValue = finalValue.substring(0, 7);
                  handleAddressChange({ target: { name: e.target.name, value: limitedValue } });
                }
              }}
              className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent ${
                !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                  ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                  : 'dark:bg-neutral-800 dark:text-white'
              }`}
              disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
              pattern="^[0-9]{4}[0-9A-Z ]{1,3}$"
              maxLength="7"
              minLength="5"
              title="Postal code must start with exactly 4 digits, followed by 1-3 letters/numbers (5-7 characters total)"
            />
            {address.postalCode && !/^[0-9]{4}[0-9A-Z ]{1,3}$/.test(address.postalCode) && (
              <p className="text-red-500 text-xs mt-1">Postal code must start with exactly 4 digits, followed by 1-3 letters/numbers (5-7 characters total)</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            name={`${prefix}.country`}
            value={address.country || ''}
            onChange={handleAddressChange}
            className={`w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded focus:ring-none focus:ring-indigo-500 focus:border-transparent country-scrollbar ${
              !isEditing || (type === 'shipping' && addressData.sameAsBilling) 
                ? 'dark:bg-neutral-900 dark:text-neutral-400' 
                : 'dark:bg-neutral-800 dark:text-white'
            }`}
            style={{ scrollbarWidth: 'thin' }}
            disabled={!isEditing || (type === 'shipping' && addressData.sameAsBilling)}
          >
            <option value="" disabled hidden>Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center font-medium gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <FaEdit className="text-sm" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex items-center font-medium gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-full hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <FaSave className="text-sm" /> Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setShowPasswordForm(false);
              }}
              className="flex items-center font-medium gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-100 dark:bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-300 transition-colors"
            >
              <FaTimes className="text-sm" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="dark:bg-neutral-950 bg-white rounded-xl shadow-sm p-6 space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 pb-6 border-b dark:border-neutral-900 border-neutral-100">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1 w-full">
            <h3 className="text-xl font-semibold mb-2">Profile Picture</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-500">
              {isEditing
                ? 'Click on the camera icon to upload a new photo. JPG, GIF or PNG. Max size 2MB.'
                : 'Update your profile picture to personalize your account.'}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg focus:ring-none focus:ring-accent focus:border-transparent"
                  required
                />
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1 flex items-center gap-2">
                <IoMailOutline className="text-neutral-500 w-4 h-4" />Email Address
              </label>
              {isEditingEmail ? (
                <form onSubmit={handleUpdateEmail} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      name="newEmail"
                      value={emailForm.newEmail}
                      onChange={handleEmailChange}
                      placeholder="Enter new email address"
                      className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={emailForm.currentPassword}
                      onChange={handleEmailChange}
                      placeholder="Enter your current password"
                      className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-800 dark:text-white"
                      required
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEmail(false);
                        setEmailForm({ newEmail: '', currentPassword: '' });
                        setEmailError('');
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Save Email
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {user.email}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1 flex items-center gap-2">
                <FaPhone className="text-neutral-500" /> Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 "
                  className="w-full p-3 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg focus:ring-none focus:ring-accent focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">{user.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-6 pt-6 border-t dark:border-neutral-900">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50 flex items-center gap-2">
              <FaMapLocationDot className="text-neutral-500" /> Address Information
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Address */}
            <div className="rounded-lg p-5 bg-neutral-50 dark:bg-neutral-900">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-50 mb-4 pb-2 border-b dark:border-neutral-700">Billing Address</h4>
              {isEditing ? (
                renderAddressForm('billing')
              ) : (
                <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  {user.billingAddress?.street ? (
                    <>
                      {user.billingAddress.firstName && (
                        <p>{user.billingAddress.firstName} {user.billingAddress.lastName}</p>
                      )}
                      <p>{user.billingAddress.street}</p>
                      <p>{user.billingAddress.postalCode} {user.billingAddress.city}</p>
                      <p>{user.billingAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-neutral-500 italic">No billing address provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg p-5 bg-neutral-50 dark:bg-neutral-900">
              <div className="flex justify-between items-center mb-4 pb-2 border-b dark:border-neutral-700">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-50 ">Shipping Address</h4>
                {isEditing && (
                  <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <input
                      type="checkbox"
                      name="sameAsBilling"
                      checked={addressData.sameAsBilling}
                      onChange={handleAddressChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Same as billing
                  </label>
                )}
              </div>

              {isEditing ? (
                renderAddressForm('shipping')
              ) : (
                <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  {user.shippingAddress?.street ? (
                    <>
                      {user.shippingAddress.firstName && (
                          <p>{user.shippingAddress.firstName} {user.shippingAddress.lastName}</p>
                      )}
                      <p>{user.shippingAddress.street}</p>
                      <p>{user.shippingAddress.postalCode} {user.shippingAddress.city}</p>
                      <p>{user.shippingAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No shipping address provided</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="pt-6 border-t dark:border-neutral-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50 flex items-center gap-2">
              <FaKey className="text-neutral-500" /> Password & Security
            </h3>
            {!showPasswordForm && (
                <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Change Password
                </button>
            )}
          </div>

          {showPasswordForm ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 dark:border-neutral-950 dark:bg-neutral-950">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg focus:ring-none focus:ring-accent focus:border-transparent"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">New Password</label>
                      <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg focus:ring-none focus:ring-accent focus:border-transparent"
                          minLength={6}
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">Confirm New Password</label>
                      <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg focus:ring-none focus:ring-accent focus:border-transparent"
                          minLength={6}
                          required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setFormData(prev => ({
                            ...prev,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          }));
                        }}
                        className="flex items-center font-medium gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-300 transition-colors"
                    >
                      <FaTimes className="text-sm" /> Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center font-medium gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      <FaEdit className="text-sm" /> Update Password
                    </button>
                  </div>
                </form>
              </div>
          ) : (
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
                <p className="text-sm text-neutral-600 dark:text-neutral-500">
                  Last changed: {user.lastPasswordChange ? new Date(user.lastPasswordChange).toLocaleDateString() : 'Never'}
                </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
