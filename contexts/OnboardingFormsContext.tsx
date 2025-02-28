import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// Onboarding form schemas
const OnboardingFormSchema = z.object({
  date_of_birth: z.date().refine(
    (value) => {
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      return value <= minAgeDate; // Ensures user is at least 16
    },
    {
      message: "Must be at least 16 years of age.",
    }
  ),
  first_name: z.string().min(1, "First name is required."),
  username: z.string().min(1, "Username is required."),
  image_buffer: z.any(),
});
export type OnboardingFormType = z.infer<typeof OnboardingFormSchema>;

// Onboarding context declaration
export const OnboardingContext = createContext<{
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}>({ selectedDate: undefined, setSelectedDate: () => {} });

// Provider that provides the context for onboarding fields
export function OnboardingFormsProvider({ children }: { children: ReactNode }) {
  const formMethods = useForm<OnboardingFormType>({
    resolver: zodResolver(OnboardingFormSchema),
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
