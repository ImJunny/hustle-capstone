import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useEffect } from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { OnboardingFormType } from "@/contexts/OnboardingFormsContext";
import { onboardingSteps } from "@/app/onboarding/_layout";
import { useAuthData } from "@/contexts/AuthContext";
// Type for component
type OnboardingNextButtonProps = {
  currentStep: (typeof onboardingSteps)[number];
  nextStep: string | null;
  currentIndex: number;
};

// Component
export default function OnboardingNextButton({
  currentStep,
  nextStep,
  currentIndex,
}: OnboardingNextButtonProps) {
  // Update mutations
  const { mutate: updateDateOfBirth } =
    trpc.onboarding.update_onboarding_date_of_birth.useMutation();
  const { mutate: updateFirstName } =
    trpc.onboarding.update_onboarding_first_name.useMutation();
  const { mutate: updateUsername } =
    trpc.onboarding.update_onboarding_username.useMutation();
  const { mutate: updateProfileImage } =
    trpc.onboarding.update_onboarding_profile_image.useMutation();

  // Use context values to edit the form
  const {
    trigger,
    watch,
    getValues,
    setError,
  }: UseFormReturn<OnboardingFormType> = useFormContext();
  const { date_of_birth, first_name, username, image_buffer } = getValues();
  const { user } = useAuthData();

  // Declare form field names to trigger validity check
  const stepFields = ["date_of_birth", "first_name", "username"] as const;
  const currentField = stepFields[currentIndex];

  // Watch field inputs for realtime validation
  const fieldValue = watch(currentField);
  useEffect(() => {
    if (fieldValue !== undefined) {
      trigger(currentField); // Validate whenever value changes
    }
  }, [fieldValue, currentField, trigger]);

  // Handle button click according to current form
  async function handleNext() {
    const isValid = await trigger(currentField);
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

    if (nextStep) {
      router.push(`/onboarding/${nextStep}` as any);
    } else {
      router.push("/(main)/(tabs)"); // Last step
    }
  }

  // Render component
  return (
    <Button style={styles.button} onPress={handleNext}>
      {currentStep !== "profile-image" ? "Next" : "Complete profile"}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
    borderRadius: 999,
    width: "100%",
  },
});
