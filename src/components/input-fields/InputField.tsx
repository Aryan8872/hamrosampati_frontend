import React from "react";
import { useTranslation } from 'react-i18next';

interface InputFieldProps {
  icon?: React.ReactNode;
  type: string;
  label?: string;
  name: string;
  placeholder: string;
  value: string;
  styles?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  styles = "",
  onBlur,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`relative border rounded-md focus:outline-none pl-4 ${styles} ${error ? "border-red-500" : "border-gray-300"}`} >
      <div className={`flex gap-5 items-center`}>
        {icon && (
          <div className="text-gray-400">
            <span className="h-8 w-8">{icon}</span>
          </div>
        )}
        <div className="block w-0.5 bg-gray-300 h-10"></div>
        <div className="flex flex-col gap-2 py-3 w-full">
          <span className="text-sm font-ManropeRegular text-gray-400">{t(label as string)}</span>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={t(placeholder)}
            onBlur={onBlur}
            className={`w-full font-ManropeMedium  focus:outline-none border-none outline-none}`}
          />
        </div>
      </div>
      {error && (
        <p className={`absolute ml-1 z-50 -bottom-5 left-0 text-red-500 text-xs mt-0.5 max-w-full break-words`}>
          {t(error)}
        </p>
      )}
    </div >
  )
};

export default InputField;