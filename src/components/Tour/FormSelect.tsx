import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Option {
  value: string;
  label: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
}

const FormSelect = ({ label, options, required = false, placeholder, ...props }: FormSelectProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t(label)} {required && <span className="text-red-500">*</span>}</label>
      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props}>
        {placeholder && <option value="">{t(placeholder)}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>{t(option.label)}</option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;