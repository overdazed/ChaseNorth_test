import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import { FaEdit, FaSave, FaTimes, FaCamera, FaKey } from 'react-icons/fa';

const PersonalInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addressData, setAddressData] = useState({
    billingAddress: '',
    shippingAddress: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: user.profilePicture || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAddressData({
        billingAddress: user.billingAddress || '',
        shippingAddress: user.shippingAddress || ''
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
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    // Dispatch password change action
    dispatch(updateUser({
      ...formData,
      password: formData.newPassword
    }));
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch update user action
    dispatch(updateUser({
      ...formData,
      ...addressData
    }));
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaEdit /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1 text-green-600 hover:text-green-800"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  email: user.email
                });
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          ) : (
            <p className="p-2 bg-gray-100 rounded">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <p className="p-2 bg-gray-100 rounded">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
