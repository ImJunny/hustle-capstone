import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import { useOnboardingFormsContext } from "@/contexts/OnboardingFormsContext";
import { router } from "expo-router";

// Type for component
type OnboardingNextButtonProps = {
  currentStep: string;
  nextStep: string | null;
};

// Component
export default function OnboardingNextButton({
  currentStep,
  nextStep,
}: OnboardingNextButtonProps) {
  // Use context values to edit the form
  const {
    selectedDate,
    dateSetValue,
    dateSetError,
    dateHandleSubmit,
    firstNameHandleSubmit,
  } = useOnboardingFormsContext();

  // Handle button click according to current form
  function handleNext() {
    if (currentStep === "date-of-birth" && dateHandleSubmit && selectedDate) {
      dateSetValue("date_of_birth", selectedDate);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      if (selectedDate > minAgeDate) {
        dateSetError("date_of_birth", {
          message: "Must be at least 16 years of age.",
        });
        return;
      }

      dateHandleSubmit(() => {
        if (nextStep) {
          router.push(`/onboarding/${nextStep}` as any);
        }
      })();
    } else if (currentStep === "first-name" && firstNameHandleSubmit) {
      firstNameHandleSubmit(() => {
        if (nextStep) {
          router.push(`/onboarding/${nextStep}` as any);
        }
      })();
    } else if (currentStep === "username") {
      router.push(`/onboarding/${nextStep}` as any);
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
