import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from "../assets/logo/hamrosampati_logo.png";
import InputField from '../components/input-fields/InputField';
import { useAuth } from '../context/AuthContext';
import { resetPassScheam } from '../schemas/resetPassSchema';
import { ResetPasswordType } from '../types/payloadType';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth()

    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [resetPassData, setResetPassData] = useState<ResetPasswordType>({
        newPassword: '',
        token: token ?? ''
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setResetPassData({ ...resetPassData, [name]: value })
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }

    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        console.log(resetPassData.token)
        console.log(resetPassData.newPassword)

        try {
            resetPassword(resetPassData.token, resetPassData.newPassword)
            setSuccess(true);
        } catch {
            setError('Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const { error } = resetPassScheam.extract(name).validate(value);
        setErrors((prev) => ({
            ...prev,
            [name]: error ? error.details[0].message : "",
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-24 w-auto"
                    src={logo} // Replace with your real estate logo
                    alt="Your Real Estate"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter a new password for your account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="space-y-6">
                            <div className="rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Password reset successfully! You can now sign in with your new password.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Go to Sign In
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-7" onSubmit={handleSubmit}>
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

                            <div className="space-y-1 relative ">

                                <div className="relative">
                                    <InputField
                                        icon={<FaLock className="text-gray-400" />}
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        label='Password'
                                        placeholder="Enter your password"
                                        value={resetPassData.newPassword}
                                        onChange={(e) => {
                                            handleChange(e)
                                            setPassword(e.target.value)
                                        }}
                                        onBlur={handleBlur}
                                        error={errors.newPassword}
                                        styles="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <IoEyeOff size={18} className="text-gray-400" />
                                        ) : (
                                            <IoEye size={18} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 relative py-2 ">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <InputField
                                        icon={<FaLock className="text-gray-400" />}
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={handleBlur}

                                        error={errors.newPassword}
                                        styles="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <IoEyeOff size={18} className="text-gray-400" />
                                        ) : (
                                            <IoEye size={18} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
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
                                            Resetting...
                                        </>
                                    ) : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;