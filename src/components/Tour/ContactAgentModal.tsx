import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../api/apiClient';
import ConfirmationModal from '../ConfirmationModal';

interface ContactAgentModalProps {
    open: boolean;
    onClose: () => void;
    propertyAddress: string;
}

const initialForm = {
    name: '',
    phone: '',
    email: '',
    message: '',
};

const ContactAgentModal: React.FC<ContactAgentModalProps> = ({ open, onClose, propertyAddress }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/contact-agent', {
                ...form,
                propertyAddress,
            });
            setShowSuccess(true);
            setForm(initialForm);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error?.response?.data?.message || 'Failed to send email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Agent</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('Name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder={t('Your Name')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('Phone number')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder={t('+1 456-678-545')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('Email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder={t('your@email.com')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('Message')}</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                                    placeholder={t('I am interested in {{property}}', { property: propertyAddress })}
                                    required
                                />
                            </div>
                            {error && <div className="text-red-600 text-sm text-center">{t(error)}</div>}
                            <button
                                type="submit"
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg w-full text-lg transition-colors disabled:opacity-60"
                                disabled={loading}
                            >
                                {t('Contact Agent')}
                            </button>
                        </form>
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-xl">
                                <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span className="text-blue-700 font-medium text-lg">{t('Sending...')}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ConfirmationModal
                onOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                onConfirm={async () => { }}
                title="Message Sent!"
                message="Your message has been sent to the agent. They will contact you soon."
                confirmText="OK"
                cancelText={''}
                type="success"
            />
        </>
    );
};

export default ContactAgentModal; 