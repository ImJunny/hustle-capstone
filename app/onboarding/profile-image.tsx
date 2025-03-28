import OnboardingImageEditor from "@/components/onboarding/OnboardingImageEditor";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { StyleSheet } from "react-native";

export default function ProfileImage() {
  return (
    <View style={[styles.page]} color="background">
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          Add a profile picture
        </Text>
        <Text>Choose any image for your profile.</Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <OnboardingImageEditor />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  button: {
    marginTop: "auto",
    borderRadius: 999,
    width: "100%",
  },
});
