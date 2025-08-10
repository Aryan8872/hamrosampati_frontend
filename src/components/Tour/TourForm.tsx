import React from 'react';
import { useTranslation } from 'react-i18next';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {t(label)} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={t(placeholder)}
        className={`
          w-full px-4 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{t(error)}</p>
      )}
    </div>
  );
};

export default FormInput;