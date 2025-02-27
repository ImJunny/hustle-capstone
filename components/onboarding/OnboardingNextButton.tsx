import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import { useOnboardingFormsContext } from "@/contexts/OnboardingFormsContext";
import { router } from "expo-router";

export default function OnboardingNextButton({
  currentStep,
  nextStep,
}: {
  currentStep: string;
  nextStep: string | null;
}) {
  const { firstNameHandleSubmit } = useOnboardingFormsContext();

  function handleNext() {
    if (currentStep === "first-name" && firstNameHandleSubmit) {
      firstNameHandleSubmit((data) => {
        if (nextStep) {
          router.push(`/onboarding/${nextStep}` as any);
        }
      })();
    }
  }

  return (
    <Button style={styles.button} onPress={handleNext}>
      Next
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
