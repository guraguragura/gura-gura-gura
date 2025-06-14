
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import BasicInfoFields from './BasicInfoFields';
import TermsCheckbox from './TermsCheckbox';
import AddressFields from './AddressFields';
import SubmitButton from './SubmitButton';
import PasswordFields from './PasswordFields';

import { useSignupForm, AddressData } from './hooks/useSignupForm';
import { validateSignupForm } from './utils/formValidation';

type SignupFormProps = {
  error: string | null;
  setError: (error: string | null) => void;
};

const SignupForm = ({ error, setError }: SignupFormProps) => {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { formState, updateField } = useSignupForm();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateSignupForm(formState);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const addressData: AddressData = {
        address: formState.address,
        city: formState.city,
        state: formState.state,
        zipCode: formState.zipCode,
        country: formState.country,
      };

      // Use phone number as the primary identifier for drivers
      const result = await signUpWithEmail(
        formState.phone, // Use phone as the email field for now
        formState.password,
        formState.firstName,
        formState.lastName,
        addressData
      );

      if (result.error) {
        setError(result.error.message || 'An error occurred during signup');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Apply to Drive</h1>
        <p className="text-xs md:text-sm text-gray-600">
          Start your journey as a Gura driver
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-2 md:p-3 rounded-md mb-4 text-xs md:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <BasicInfoFields 
          firstName={formState.firstName}
          lastName={formState.lastName}
          email={formState.email}
          phone={formState.phone}
          setFirstName={(value) => updateField('firstName', value)}
          setLastName={(value) => updateField('lastName', value)}
          setEmail={(value) => updateField('email', value)}
          setPhone={(value) => updateField('phone', value)}
          signupMethod="phone"
        />

        <PasswordFields
          password={formState.password}
          confirmPassword={formState.confirmPassword}
          setPassword={(value) => updateField('password', value)}
          setConfirmPassword={(value) => updateField('confirmPassword', value)}
        />

        <AddressFields
          address={formState.address}
          city={formState.city}
          state={formState.state}
          zipCode={formState.zipCode}
          country={formState.country}
          setAddress={(value) => updateField('address', value)}
          setCity={(value) => updateField('city', value)}
          setState={(value) => updateField('state', value)}
          setZipCode={(value) => updateField('zipCode', value)}
          setCountry={(value) => updateField('country', value)}
        />

        <TermsCheckbox
          checked={formState.agreeToTerms}
          onCheckedChange={(checked) => updateField('agreeToTerms', !!checked)}
        />

        <SubmitButton
          isLoading={isLoading}
          label="Submit Application"
          loadingLabel="Submitting Application..."
        />
      </form>
    </div>
  );
};

export default SignupForm;
