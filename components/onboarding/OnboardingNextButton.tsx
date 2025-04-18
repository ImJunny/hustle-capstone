import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAuthData } from "@/contexts/AuthContext";
import { z } from "zod";
import { OnboardingFormSchema } from "@/zod/zod-schemas";
import { onboardingSteps } from "@/app/onboarding/_layout";

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
  const { mutate: updateUsername, isLoading: usernameLoading } =
    trpc.onboarding.update_onboarding_username.useMutation({
      onSuccess: () => {
        handleRedirect();
        clearErrors("username");
      },
      onError: (error) => {
        setError("username", { message: error.message });
      },
    });
  const { mutate: updateDisplayName, isLoading: displayNameLoading } =
    trpc.onboarding.update_onboarding_display_name.useMutation({
      onSuccess: () => {
        handleRedirect();
        clearErrors("display_name");
      },
      onError: (error) => {
        setError("display_name", { message: error.message });
      },
    });
  const { mutate: updateProfileImage, isLoading: imageLoading } =
    trpc.onboarding.update_onboarding_profile_image.useMutation({
      onSuccess: handleRedirect,
    });

  // Use context values to edit the form
  const { trigger, watch, getValues, setError, clearErrors } =
    useFormContext<z.infer<typeof OnboardingFormSchema>>();
  const isLoading =
    dateLoading || displayNameLoading || usernameLoading || imageLoading;
  const { user } = useAuthData();

  // Declare form field names to trigger validity check
  const stepFields = ["date_of_birth", "username", "display_name"] as const;
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
    const { date_of_birth, username, display_name, image_buffer } = getValues();
    const isValid =
      (await trigger(currentField)) || currentStep === "profile-image";
    if (!isValid || !user) return;

    if (currentStep === "date-of-birth") {
      await updateDateOfBirth({
        uuid: user.id,
        date_of_birth,
      });
    } else if (currentStep === "username") {
      await updateUsername({
        uuid: user.id,
        username,
      });
    } else if (currentStep === "display-name") {
      await updateDisplayName({
        uuid: user.id,
        display_name,
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
      utils.user.get_user_data.invalidate();
      router.replace("/location-prompt" as any);
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
