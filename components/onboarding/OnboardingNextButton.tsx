import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useEffect, useState } from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { OnboardingFormType } from "@/contexts/OnboardingFormsContext";
import { onboardingSteps } from "@/app/onboarding/_layout";
import { useAuthData } from "@/contexts/AuthContext";

// Type for component
type OnboardingNextButtonProps = {
  currentStep: (typeof onboardingSteps)[number];
  nextStep: (typeof onboardingSteps)[number] | null;
  currentIndex: number;
};

// Component
export default function OnboardingNextButton({
  currentStep,
  nextStep,
  currentIndex,
}: OnboardingNextButtonProps) {
  const utils = trpc.useUtils();
  // Update mutations
  const { mutate: updateDateOfBirth, isLoading: dateLoading } =
    trpc.onboarding.update_onboarding_date_of_birth.useMutation({
      onSuccess: handleRedirect,
    });
  const { mutate: updateFirstName, isLoading: firstNameLoading } =
    trpc.onboarding.update_onboarding_first_name.useMutation({
      onSuccess: handleRedirect,
    });
  const { mutate: updateUsername, isLoading: usernameLoading } =
    trpc.onboarding.update_onboarding_username.useMutation({
      onSuccess: () => {
        handleRedirect();
        clearErrors("username");
      },
      onError: () => {
        setError("username", { message: "Username is already taken." });
      },
    });
  const { mutate: updateProfileImage, isLoading: imageLoading } =
    trpc.onboarding.update_onboarding_profile_image.useMutation({
      onSuccess: handleRedirect,
    });

  // Use context values to edit the form
  const {
    trigger,
    watch,
    getValues,
    setError,
    clearErrors,
  }: UseFormReturn<OnboardingFormType> = useFormContext();
  const isLoading =
    dateLoading || firstNameLoading || usernameLoading || imageLoading;
  const { user } = useAuthData();

  // Declare form field names to trigger validity check
  const stepFields = ["date_of_birth", "first_name", "username"] as const;
  const currentField = stepFields[currentIndex];

  // Watch field inputs for validation
  const fieldValue = watch(currentField);
  useEffect(() => {
    if (currentStep === "profile-image") return;
    if (fieldValue !== undefined && fieldValue !== null) trigger(currentField);
  }, [fieldValue]);

  useEffect(() => {
    clearErrors();
  }, [currentStep]);

  // Handle button click according to current form
  async function handleNext() {
    const { date_of_birth, first_name, username, image_buffer } = getValues();
    const isValid =
      (await trigger(currentField)) || currentStep === "profile-image";
    if (!isValid || !user) return;

    if (currentStep === "date-of-birth") {
      await updateDateOfBirth({
        uuid: user.id,
        date_of_birth,
      });
    } else if (currentStep === "first-name") {
      await updateFirstName({
        uuid: user.id,
        first_name,
      });
    } else if (currentStep === "username") {
      await updateUsername({
        uuid: user.id,
        username,
      });
    } else if (currentStep === "profile-image") {
      await updateProfileImage({
        uuid: user.id,
        image_buffer,
      });
    }
  }

  async function handleRedirect() {
    if (nextStep) {
      router.push(`/onboarding/${nextStep}` as any);
    } else {
      router.push("/(main)/(tabs)");

      await utils.user.get_user_data.invalidate();
    }
  }

  // Render component
  return (
    <Button style={styles.nextButton} onPress={handleNext} disabled={isLoading}>
      {currentStep !== "profile-image" ? "Next" : "Complete profile"}
    </Button>
  );
}

const styles = StyleSheet.create({
  nextButton: {
    marginTop: "auto",
    borderRadius: 999,
  },
});
