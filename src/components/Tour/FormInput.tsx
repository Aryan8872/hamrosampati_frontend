import React from 'react';
import { useTranslation } from 'react-i18next';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
}

const FormInput = ({ label, required = false, ...props }: FormInputProps) => {
    const { t } = useTranslation();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t(label)} {required && <span className="text-red-500">*</span>}</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props} />
        </div>
    );
}

export default FormInput; 