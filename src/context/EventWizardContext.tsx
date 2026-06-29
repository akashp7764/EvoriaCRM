import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface EventWizardDetails {
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  imageURL: string;
  eventTypeId?: number | string;
  maxguestCapacity?: number | string;
  eventManagerId?: number | string;
  autoApprove?: boolean;
}

export interface FormSchemaField {
  id: string;
  type: 'text' | 'email' | 'select' | 'number' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
}

const DEFAULT_FEEDBACK_SCHEMA: FormSchemaField[] = [
  { id: 'rating', type: 'number', label: 'Overall Rating (1-5)', required: true },
  { id: 'comments', type: 'textarea', label: 'Additional Comments', required: false },
];

interface EventWizardContextType {
  eventDetails: Partial<EventWizardDetails>;
  setEventDetails: (details: Partial<EventWizardDetails>) => void;
  formSchema: FormSchemaField[];
  setFormSchema: (schema: FormSchemaField[]) => void;
  feedbackSchema: FormSchemaField[];
  setFeedbackSchema: (schema: FormSchemaField[]) => void;
  bannerFile: File | null;
  setBannerFile: (file: File | null) => void;
  currentStep: number;
  setStep: (step: number) => void;
  resetWizard: () => void;
}

// Context
const EventWizardContext = createContext<EventWizardContextType | undefined>(undefined);

// Provider
export const EventWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eventDetails, setEventDetails] = useState<Partial<EventWizardDetails>>({});
  const [formSchema, setFormSchema] = useState<FormSchemaField[]>([]);
  const [feedbackSchema, setFeedbackSchema] = useState<FormSchemaField[]>(DEFAULT_FEEDBACK_SCHEMA);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [currentStep, setStep] = useState<number>(1);

  const resetWizard = () => {
    setEventDetails({});
    setFormSchema([]);
    setFeedbackSchema(DEFAULT_FEEDBACK_SCHEMA);
    setBannerFile(null);
    setStep(1);
  };

  return (
    <EventWizardContext.Provider
      value={{
        eventDetails,
        setEventDetails,
        formSchema,
        setFormSchema,
        feedbackSchema,
        setFeedbackSchema,
        bannerFile,
        setBannerFile,
        currentStep,
        setStep,
        resetWizard,
      }}
    >
      {children}
    </EventWizardContext.Provider>
  );
};

// Hook
export const useEventWizard = () => {
  const context = useContext(EventWizardContext);
  if (!context) {
    throw new Error('useEventWizard must be used within an EventWizardProvider');
  }
  return context;
};
