import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import { FaEdit, FaSave, FaTimes, FaCamera, FaKey, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { countries } from '../../data/countries.jsx';

const PersonalInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit className="text-sm" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaSave className="text-sm" /> Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setShowPasswordForm(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaTimes className="text-sm" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 pb-6 border-b">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
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
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
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
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Click on the camera icon to upload a new photo. JPG, GIF or PNG. Max size 2MB.'
                : 'Update your profile picture to personalize your account.'}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {user.email}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaPhone className="text-gray-500" /> Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 "
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{user.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" /> Address Information
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Address */}
            <div className="border rounded-lg p-5 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4 pb-2 border-b">Billing Address</h4>
              {isEditing ? (
                renderAddressForm('billing')
              ) : (
                <div className="space-y-2 text-gray-700">
                  {user.billingAddress?.street ? (
                    <>
                      {user.billingAddress.firstName && (
                        <p>{user.billingAddress.firstName} {user.billingAddress.lastName}</p>
                      )}
                      <p>{user.billingAddress.street}</p>
                      <p>{user.billingAddress.city} {user.billingAddress.postalCode}</p>
                      <p>{user.billingAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No billing address provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h4 className="font-medium text-gray-900">Shipping Address</h4>
                {isEditing && (
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="sameAsBilling"
                      checked={addressData.sameAsBilling}
                      onChange={handleAddressChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Same as billing
                  </label>
                )}
              </div>

              {isEditing ? (
                renderAddressForm('shipping')
              ) : (
                <div className="space-y-2 text-gray-700">
                  {user.shippingAddress?.street ? (
                    <>
                      {user.shippingAddress.firstName && (
                          <p>{user.shippingAddress.firstName} {user.shippingAddress.lastName}</p>
                      )}
                      <p>{user.shippingAddress.street}</p>
                      <p>{user.shippingAddress.city} {user.shippingAddress.postalCode}</p>
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
        <div className="pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaKey className="text-yellow-500" /> Password & Security
            </h3>
            {!showPasswordForm && (
                <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change Password
                </button>
            )}
          </div>

          {showPasswordForm ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          minLength={6}
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
          ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
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
