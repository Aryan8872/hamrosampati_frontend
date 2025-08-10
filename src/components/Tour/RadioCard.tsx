import React from 'react';
import { FaCheck } from 'react-icons/fa6';

interface RadioCardProps {
  id: string;
  title: string;
  description: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const RadioCard: React.FC<RadioCardProps> = ({
  id,
  title,
  description,
  value,
  checked,
  onChange,
  icon,
}) => {
  return (
    <div
      className={`
        relative p-5 border rounded-lg cursor-pointer
        transition-all duration-300 ease-in-out
        ${checked
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
      onClick={() => onChange(value)}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 mr-4">
            {icon}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div
              className={`
                w-5 h-5 border rounded-full flex items-center justify-center
                ${checked
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
                }
              `}
            >
              {checked && <FaCheck className="w-3 h-3 text-white" />}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <input
        type="radio"
        name={id}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
    </div>
  );
};

export default RadioCard;