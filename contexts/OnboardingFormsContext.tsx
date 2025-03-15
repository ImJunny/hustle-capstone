import { OnboardingFormSchema } from "@/zod/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// Provider that provides the context for onboarding fields
export function OnboardingFormsProvider({ children }: { children: ReactNode }) {
  const formMethods = useForm<z.infer<typeof OnboardingFormSchema>>({
    resolver: zodResolver(OnboardingFormSchema),
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
