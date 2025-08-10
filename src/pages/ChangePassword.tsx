import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo/hamrosampati_logo.png";
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { requestResetPassword, user } = useAuth();
    const userEmail = user?.email ?? '';
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);
        if (!userEmail) {
            setError('No email found for your account.');
            setIsLoading(false);
            return;
        }
        try {
            await requestResetPassword(userEmail);
            setSuccess(true);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError('Failed to send reset link. Please try again.');
            } else {
                setError('Failed to send reset link. Please try again.');
            }
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-24 w-auto"
                    src={logo}
                    alt="Your Real Estate"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Want to change your password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    We'll send a reset link to your email address below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success ? (
                        <>
                            <div className="rounded-md bg-blue-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-blue-800">
                                            Password reset link sent to {userEmail}. Please check your email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                            </div>
                        </>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <MdEmail className="text-xl text-gray-500" />
                                <span className="text-lg text-gray-700">{userEmail}</span>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : 'Send reset link'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;