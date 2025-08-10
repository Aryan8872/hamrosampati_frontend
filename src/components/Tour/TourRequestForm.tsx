import React, { useState } from 'react';
import ConfirmationStep from './Step/ConfirmationStep';
import PersonalInfoStep from './Step/PersonalDetailsStep';
import PropertyDetailsStep from './Step/PropertyDetailsStep';
import SchedulingStep from './Step/ScheduleStep';
import SuccessStep from './Step/SuccessStep';
import StepIndicator from './StepIndicator';


export type TourRequestData = {
    fullName: string;
    email: string;
    phone: string;
    propertyId: string;
    preferredDate: string;
    preferredTime: string;
};

const initialFormData: TourRequestData = {
    fullName: '',
    email: '',
    phone: '',
    propertyId: '',
    preferredDate: '',
    preferredTime: '',
};

interface TourRequestFormProps {
    onSuccess?: () => void;
}

const TourRequestForm: React.FC<TourRequestFormProps> = ({ onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<TourRequestData>(initialFormData);

    const steps = [
        'Personal Information',
        'Property Details',
        'Schedule Tour',
        'Confirm Details',
    ];

    const updateFormData = (data: Partial<TourRequestData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
        console.log("clicked next the step is ", currentStep)
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        console.log('Submitting form data:', formData);
        setCurrentStep(steps.length);
        if (onSuccess) onSuccess();
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Request a Tour</h1>
                <p className="text-gray-600 mt-2">
                    Schedule a viewing of your dream home
                </p>
            </div>

            {currentStep < steps.length ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <StepIndicator steps={steps} currentStep={currentStep} />

                        <div className="mt-8">
                            {currentStep === 0 && (
                                <PersonalInfoStep
                                    formData={formData}
                                    updateFormData={updateFormData}
                                    onNext={handleNext}
                                />
                            )}

                            {currentStep === 1 && (
                                <PropertyDetailsStep
                                    updateFormData={updateFormData}
                                    onNext={handleNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 2 && (
                                <SchedulingStep
                                    formData={formData}
                                    updateFormData={updateFormData}
                                    onNext={handleNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 3 && (
                                <ConfirmationStep
                                    formData={formData}
                                    onBack={handleBack}
                                    onSubmit={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <SuccessStep formData={formData} />
            )}
        </div>
    );
};

export default TourRequestForm;