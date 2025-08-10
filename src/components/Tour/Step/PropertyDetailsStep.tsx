import React from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { TourRequestData } from '../TourRequestForm';

interface PropertyDetailsStepProps {
    updateFormData: (data: Partial<TourRequestData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
    onNext,
    onBack,
    updateFormData
}) => {

    const { propertyById } = useProperty()

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
                <p className="text-gray-600 mt-1">
                    Confirm the property and select your tour preference
                </p>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
                <div className="p-4">
                    <h3 className="font-medium text-gray-900">Selected Property</h3>
                    <p className="mt-1 text-gray-600">PropertyName: {propertyById?.propertyName}</p>

                    <p className="mt-1 text-gray-600">Address: {propertyById?.address}</p>
                </div>
            </div>




            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                >
                    Back
                </button>

                <button
                    onClick={() => {
                        onNext()
                        updateFormData({ propertyId: propertyById?.propertyId })
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PropertyDetailsStep;