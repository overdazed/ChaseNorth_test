import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Set the token in the default headers
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Fetch user data
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`);
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                // Clear invalid token
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                email,
                password
            });
            
            const { token, ...userData } = response.data;
            
            // Store the token in localStorage
            localStorage.setItem('token', token);
            
            // Set the token in the default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed. Please try again.' 
            };
        }
    };

    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Remove the authorization header
        delete axios.defaults.headers.common['Authorization'];
        // Clear user state
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
