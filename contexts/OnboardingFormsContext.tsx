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
} from "react-hook-form";
import { z } from "zod";

const OnboardingFirstNameSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
});
type FirstNameFormType = z.infer<typeof OnboardingFirstNameSchema>;

export function useOnboardingFormsContext() {
  return useContext(OnboardingFormsContext);
}
export const OnboardingFormsContext = createContext<{
  firstNameControl: Control<FirstNameFormType> | undefined;
  firstNameHandleSubmit: UseFormHandleSubmit<FirstNameFormType> | undefined;
  firstNameErrors: FieldErrors<FirstNameFormType>;
}>({
  firstNameControl: undefined,
  firstNameHandleSubmit: undefined,
  firstNameErrors: {},
});

export function OnboardingFormsProvider({ children }: { children: ReactNode }) {
  // Form data
  const {
    control: firstNameControl,
    formState: { errors: firstNameErrors },
    handleSubmit: firstNameHandleSubmit,
  } = useForm<z.infer<typeof OnboardingFirstNameSchema>>({
    resolver: zodResolver(OnboardingFirstNameSchema),
  });

  const value = { firstNameControl, firstNameHandleSubmit, firstNameErrors };
  return (
    <OnboardingFormsContext.Provider value={value}>
      {children}
    </OnboardingFormsContext.Provider>
  );
}
