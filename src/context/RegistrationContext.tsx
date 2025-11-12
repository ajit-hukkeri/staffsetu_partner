// src/context/RegistrationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type RegistrationData = {
  language: 'en' | 'hi' | 'kn' | null;
  location: { latitude: number; longitude: number } | null;
  firstName: string;
  lastName: string;
  phoneNumber: string; // <-- 1. ADD THIS FIELD
  dob: string;
  address: string;
  workingCity: string;
  skills: string[];
  vehicle: { hasVehicle: boolean; type?: string };
  aadhaarNumber: string;
  aadhaarPhotoUri: string | null;
  selfieUri: string | null;
};

type RegistrationContextType = {
  formData: RegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationData>>;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialState: RegistrationData = {
  language: null,
  location: null,
  firstName: '',
  lastName: '',
  phoneNumber: '', // <-- 2. ADD THIS TO THE INITIAL STATE
  dob: '',
  address: '',
  workingCity: '',
  skills: [],
  vehicle: { hasVehicle: false },
  aadhaarNumber: '',
  aadhaarPhotoUri: null,
  selfieUri: null,
};

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<RegistrationData>(initialState);

  return (
    <RegistrationContext.Provider value={{ formData, setFormData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};