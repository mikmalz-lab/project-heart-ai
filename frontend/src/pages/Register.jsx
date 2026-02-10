import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Optional: auto login after register
    const { login, loginGoogle } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authAPI.register({ name, email, password });
            // Redirect to login or auto login
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">HEART Register</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Register'}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        text="signup_with"
                        onSuccess={async (credentialResponse) => {
                            try {
                                await loginGoogle(credentialResponse.credential);
                                navigate('/');
                            } catch (err) {
                                setError('Google Signup Failed');
                            }
                        }}
                        onError={() => {
                            setError('Google Signup Failed');
                        }}
                    />
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}
