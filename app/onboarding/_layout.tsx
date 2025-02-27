import { useSegments, Stack } from "expo-router";
import View from "@/components/ui/View";
import { OnboardingFormsProvider } from "@/contexts/OnboardingFormsContext";
import OnboardingNextButton from "@/components/onboarding/OnboardingNextButton";
import OnboardingSteps from "@/components/onboarding/OnboardingSteps";

// Define the onboarding steps in order
const steps = ["date-of-birth", "first-name", "username", "profile-image"];

export default function Layout() {
  const segments = useSegments();
  const currentStep = segments[segments.length - 1]; // Get current screen name

  // Get the index of the current step in the list
  const currentIndex = steps.indexOf(currentStep);

  // Find the next step, if available
  const nextStep =
    currentIndex !== -1 && currentIndex < steps.length - 1
      ? steps[currentIndex + 1]
      : null;

  return (
    <OnboardingFormsProvider>
      <View style={{ flex: 1, padding: 16 }}>
        <OnboardingSteps stepNumber={currentIndex + 1} />
        <Stack
          screenOptions={{ animation: "ios_from_right", headerShown: false }}
        >
          <Stack.Screen name="first-name" />
          <Stack.Screen name="date-of-birth" />
          <Stack.Screen name="username" />
          <Stack.Screen name="profile-image" />
        </Stack>

        <OnboardingNextButton currentStep={currentStep} nextStep={nextStep} />
      </View>
    </OnboardingFormsProvider>
  );
}
