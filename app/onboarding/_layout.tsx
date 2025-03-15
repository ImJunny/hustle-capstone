import { useSegments, Stack, router } from "expo-router";
import View from "@/components/ui/View";
import { OnboardingFormsProvider } from "@/contexts/OnboardingFormsContext";
import OnboardingNextButton from "@/components/onboarding/OnboardingNextButton";
import OnboardingSteps from "@/components/onboarding/OnboardingSteps";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/server/lib/supabase";
import Toast from "react-native-toast-message";
import { trpc } from "@/server/lib/trpc-client";

// Define the onboarding steps in order
export const onboardingSteps = [
  "date-of-birth",
  "username",
  "display-name",
  "profile-image",
] as const;

export default function Layout() {
  const segments = useSegments();
  const currentStep = segments[
    segments.length - 1
  ] as (typeof onboardingSteps)[number]; // Get current screen name

  // Get the index of the current step in the list
  const currentIndex = onboardingSteps.indexOf(currentStep);

  // Find the next step, if available
  const nextStep =
    currentIndex !== -1 && currentIndex < onboardingSteps.length - 1
      ? (onboardingSteps[currentIndex + 1] as (typeof onboardingSteps)[number])
      : null;

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    Toast.show({
      text1: error ? "Error signing out" : "Signed out",
      type: error ? "error" : "info",
      swipeable: false,
    });
    if (error) return;
    router.replace("/signin");
    const utils = trpc.useUtils();
    await utils.invalidate();
  }

  return (
    <OnboardingFormsProvider>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.topRow}>
          <OnboardingSteps stepNumber={currentIndex + 1} />
          <TouchableOpacity onPress={handleSignout}>
            <Text weight="semibold" style={styles.signOutText}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>

        <Stack
          screenOptions={{ animation: "ios_from_right", headerShown: false }}
        >
          <Stack.Screen name="date-of-birth" />
          <Stack.Screen name="username" />
          <Stack.Screen name="display-name" />
          <Stack.Screen name="profile-image" />
        </Stack>

        <OnboardingNextButton
          currentStep={currentStep}
          nextStep={nextStep}
          currentIndex={currentIndex}
        />
      </View>
    </OnboardingFormsProvider>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signOutText: {
    textDecorationLine: "underline",
  },
});
