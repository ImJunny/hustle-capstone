import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";

// Onboarding form schemas
const OnboardingDateOfBirthSchema = z.object({
  date_of_birth: z.date(),
});
const OnboardingFirstNameSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
});
const OnboardingUsernameSchema = z.object({
  user_name: z.string().min(1, "First name is required."),
});

// Onboarding form types
export type DateOfBirthFormType = z.infer<typeof OnboardingDateOfBirthSchema>;
export type FirstNameFormType = z.infer<typeof OnboardingFirstNameSchema>;
export type UsernameFormType = z.infer<typeof OnboardingUsernameSchema>;

// Define context form data
export const OnboardingFormsContext = createContext<{
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  selectedDate: Date | undefined;
  dateSetValue: UseFormSetValue<DateOfBirthFormType>;
  dateHandleSubmit: UseFormHandleSubmit<DateOfBirthFormType> | undefined;
  dateErrors: FieldErrors<DateOfBirthFormType>;
  dateSetError: UseFormSetError<DateOfBirthFormType>;
  firstNameControl: Control<FirstNameFormType> | undefined;
  firstNameHandleSubmit: UseFormHandleSubmit<FirstNameFormType> | undefined;
  firstNameErrors: FieldErrors<FirstNameFormType>;
  usernameControl: Control<UsernameFormType> | undefined;
  usernameHandleSubmit: UseFormHandleSubmit<UsernameFormType> | undefined;
  usernameErrors: FieldErrors<UsernameFormType>;
}>({
  setSelectedDate: () => {},
  selectedDate: undefined,
  dateSetValue: () => {},
  dateHandleSubmit: undefined,
  dateErrors: {},
  dateSetError: () => {},
  firstNameControl: undefined,
  firstNameHandleSubmit: undefined,
  firstNameErrors: {},
  usernameControl: undefined,
  usernameHandleSubmit: undefined,
  usernameErrors: {},
});

// Onboarding context to be used by provider children
export function useOnboardingFormsContext() {
  return useContext(OnboardingFormsContext);
}

// Provider that provides the context
export function OnboardingFormsProvider({ children }: { children: ReactNode }) {
  // Onboarding form declarations
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const {
    setValue: dateSetValue,
    formState: { errors: dateErrors },
    setError: dateSetError,
    handleSubmit: dateHandleSubmit,
  } = useForm<z.infer<typeof OnboardingDateOfBirthSchema>>({
    resolver: zodResolver(OnboardingDateOfBirthSchema),
  });
  const {
    control: firstNameControl,
    formState: { errors: firstNameErrors },
    handleSubmit: firstNameHandleSubmit,
  } = useForm<z.infer<typeof OnboardingFirstNameSchema>>({
    resolver: zodResolver(OnboardingFirstNameSchema),
  });
  const {
    control: usernameControl,
    formState: { errors: usernameErrors },
    handleSubmit: usernameHandleSubmit,
  } = useForm<z.infer<typeof OnboardingUsernameSchema>>({
    resolver: zodResolver(OnboardingUsernameSchema),
  });

  const value = {
    selectedDate,
    setSelectedDate,
    dateSetValue,
    dateHandleSubmit,
    dateErrors,
    dateSetError,
    firstNameControl,
    firstNameHandleSubmit,
    firstNameErrors,
    usernameControl,
    usernameHandleSubmit,
    usernameErrors,
  };
  return (
    <OnboardingFormsContext.Provider value={value}>
      {children}
    </OnboardingFormsContext.Provider>
  );
}
