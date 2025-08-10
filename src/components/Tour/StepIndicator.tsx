import { Checkbox } from '@headlessui/react';
import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        return (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full 
                  ${isCompleted ? 'bg-blue-600' : isActive ? 'bg-blue-500' : 'bg-gray-200'} 
                  transition-all duration-300
                `}
              >
                {isCompleted ? (
                  <Checkbox className="text-white w-4 h-4" />
                ) : (
                  <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`
                text-xs mt-1 hidden sm:block
                ${isActive ? 'text-blue-600 font-medium' : isCompleted ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {step}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div 
                  className={`h-1 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;