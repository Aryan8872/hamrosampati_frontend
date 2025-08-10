import React, { useState } from 'react';
import { tourRequestPersonalInfoSchema } from '../../../schemas/tourSchema';
import FormInput from '../TourForm';
import { TourRequestData } from '../TourRequestForm';

interface PersonalInfoStepProps {
  formData: TourRequestData;
  updateFormData: (data: Partial<TourRequestData>) => void;
  onNext: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const { error } = tourRequestPersonalInfoSchema.validate(
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      { abortEarly: false, stripUnknown: true } // <- this strips any unknown fields
    );

    if (error) {
      const formattedErrors: Record<string, string> = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as string;
        formattedErrors[field] = detail.message;
      });
      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-600 mt-1">
          We'll use this information to contact you about the tour
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          required
          error={errors.fullName}
        />
      </div>

      <FormInput
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        required
        error={errors.email}
      />

      <FormInput
        id="phone"
        label="Phone Number"
        value={formData.phone}
        onChange={(e) => updateFormData({ phone: e.target.value })}
        required
        error={errors.phone}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;
