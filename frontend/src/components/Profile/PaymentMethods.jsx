import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCreditCard, FaPlus, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa';

const PaymentMethods = () => {
    const { user } = useSelector((state) => state.auth);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newPaymentMethod, setNewPaymentMethod] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        isDefault: false
    });
    const [editingId, setEditingId] = useState(null);
    const [editPaymentMethod, setEditPaymentMethod] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    // Fetch payment methods from backend
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await fetch(`/api/users/${user._id}/payment-methods`);
                if (response.ok) {
                    const data = await response.json();
                    setPaymentMethods(data);
                }
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };

        if (user && user._id) {
            fetchPaymentMethods();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditPaymentMethod(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${user._id}/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPaymentMethod),
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(prev => [...prev, data]);
                setNewPaymentMethod({
                    cardNumber: '',
                    cardHolder: '',
                    expiryDate: '',
                    cvv: '',
                    isDefault: false
                });
            }
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    };

    const handleDeletePaymentMethod = async (id) => {
        try {
            const response = await fetch(`/api/users/${user._id}/payment-methods/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPaymentMethods(prev => prev.filter(method => method._id !== id));
            }
        } catch (error) {
            console.error('Error deleting payment method:', error);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await fetch(`/api/users/${user._id}/payment-methods/${id}/default`, {
                method: 'PUT',
            });

            if (response.ok) {
                const updatedMethods = paymentMethods.map(method => ({
                    ...method,
                    isDefault: method._id === id
                }));
                setPaymentMethods(updatedMethods);
            }
        } catch (error) {
            console.error('Error setting default payment method:', error);
        }
    };

    const handleEditPaymentMethod = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${user._id}/payment-methods/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editPaymentMethod),
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(prev => prev.map(method => 
                    method._id === editingId ? data : method
                ));
                setEditingId(null);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
        }
    };

    const startEditing = (method) => {
        setEditingId(method._id);
        setEditPaymentMethod({
            cardNumber: method.cardNumber,
            cardHolder: method.cardHolder,
            expiryDate: method.expiryDate,
            cvv: '' // Don't pre-fill CVV for security
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

            {/* Add New Payment Method Form */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Add New Payment Method</h3>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={newPaymentMethod.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Card Holder</label>
                            <input
                                type="text"
                                name="cardHolder"
                                value={newPaymentMethod.cardHolder}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={newPaymentMethod.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={newPaymentMethod.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={newPaymentMethod.isDefault}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="rounded"
                            id="isDefault"
                        />
                        <label htmlFor="isDefault" className="text-sm">Set as Default</label>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Payment Method
                    </button>
                </form>
            </div>

            {/* Payment Methods List */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Saved Payment Methods</h3>

                {paymentMethods.length === 0 ? (
                    <p className="text-gray-500">No payment methods saved yet.</p>
                ) : (
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div key={method._id} className={`p-4 border rounded-lg ${method.isDefault ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-neutral-700'}`}>
                                {editingId === method._id ? (
                                    <form onSubmit={handleEditPaymentMethod} className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Card Number</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={editPaymentMethod.cardNumber}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Card Holder</label>
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    value={editPaymentMethod.cardHolder}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={editPaymentMethod.expiryDate}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={editPaymentMethod.cvv}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                        <div className="flex items-center space-x-3">
                                            <FaCreditCard className="text-blue-600 text-xl" />
                                            <div>
                                                <p className="font-medium">**** **** **** {method.cardNumber.slice(-4)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {method.cardHolder} • Expires {method.expiryDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {method.isDefault && (
                                                <span className="text-green-600 text-sm flex items-center">
                                                    <FaCheckCircle className="mr-1" />
                                                    Default
                                                </span>
                                            )}
                                            <button
                                                onClick={() => startEditing(method)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePaymentMethod(method._id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                            >
                                                <FaTrash />
                                            </button>
                                            {!method.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(method._id)}
                                                    className="text-green-600 hover:text-green-800 p-1"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethods;