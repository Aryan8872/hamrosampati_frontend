import Joi from 'joi';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingFallback from '../components/LoadingFallback';
import { useAuth } from '../context/AuthContext';

const editProfileJoiSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email',
        }),
    fullName: Joi.string().min(5).max(30).required().messages({
        'string.empty': 'Full name is required',
        'string.min': 'Full name should have at least 5 characters',
        'string.max': 'Full name should have at most 30 characters',
    }),
    phoneNumber: Joi.string()
        .pattern(new RegExp('^[0-9]{10}$'))
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Please enter a valid phone number (10 digits)',
        }),
});

export default function EditProfile() {
    const { user, refreshUser, editProfile } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
            });
            setInitialLoading(false);
        }
    }, [user]);

    const validate = () => {
        const { error } = editProfileJoiSchema.validate(form, { abortEarly: false });
        const errs: { [k: string]: string } = {};
        if (error) {
            error.details.forEach((detail) => {
                if (detail.path[0]) {
                    errs[detail.path[0]] = detail.message;
                }
            });
        }
        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setLoading(true);
        let result;
        try {
            result = await editProfile(form);
            if (result.success) {
                refreshUser && refreshUser();
                setForm(f => ({ ...f, password: '' }));
            }
        } catch (err) {
            result = { success: false, error: 'An error occurred while updating profile' };
        } finally {
            setLoading(false);
            setTimeout(() => {
                if (result) {
                    if (result.success) {
                        toast.success(result.message || 'Profile updated successfully!');
                    } else {
                        toast.error(result.error || 'Failed to update profile');
                    }
                }
            }, 200);
        }
    };

    if (initialLoading) return <LoadingFallback />;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 mt-12">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="relative">
                    <img
                        src="https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                    />

                </div>
                <div>
                    <h1 className="text-2xl font-ManropeSemiBold text-gray-900">{form.fullName}</h1>
                    <p className="text-gray-600">{form.email}</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <label className="text-base text-gray-700 font-ManropeMedium">Name</label>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className="text-base text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-2/3 text-right"
                        disabled={loading}
                    />
                </div>
                {errors.fullName && <div className="text-red-500 text-sm mt-1 text-right">{errors.fullName}</div>}

                {/* Email Field */}
                <div className="flex items-center justify-between">
                    <label className="text-base text-gray-700 font-ManropeMedium">Email account</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="text-base text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-2/3 text-right"
                        disabled={loading}
                    />
                </div>
                {errors.email && <div className="text-red-500 text-sm mt-1 text-right">{errors.email}</div>}

                {/* Mobile Number Field */}
                <div className="flex items-center justify-between">
                    <label className="text-base text-gray-700 font-ManropeMedium">Mobile number</label>
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="text-base text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-2/3 text-right"
                        disabled={loading}
                    />
                </div>
                {errors.phoneNumber && <div className="text-red-500 text-sm mt-1 text-right">{errors.phoneNumber}</div>}

                {/* Password Field */}
                <div className="flex items-center justify-between">
                    <label className="text-base text-gray-700 font-ManropeMedium">Password</label>
                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-ManropeMedium transition-colors"
                        onClick={() => navigate('/change-password')}
                        disabled={loading}
                    >
                        Reset Password
                    </button>
                </div>
                {errors.password && <div className="text-red-500 text-sm mt-1 text-right">{errors.password}</div>}
            </div>

            {/* Save Button */}
            <div className="mt-12 text-right">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-ManropeMedium  transition-colors"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Save Change'}
                </button>
            </div>
        </form>
    );
} 