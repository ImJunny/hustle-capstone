import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function SignInScreen() {
  const themeColor = useThemeColor();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text
          size="3xl"
          style={{
            fontFamily: "Lexend-bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Hustle
        </Text>
        <View style={styles.formContainer}>
          <Input placeholder="Email or username" style={styles.input} />
          <Input placeholder="Password" style={styles.input} />
          <Button isFullWidth onPress={() => router.replace("/(tabs)")}>
            Log In
          </Button>
          <View style={styles.separatorContainer}>
            <Separator color="border" style={{ position: "absolute" }} />
            <Text
              color="muted"
              style={[
                styles.separatorText,
                { backgroundColor: themeColor.background },
              ]}
            >
              OR
            </Text>
          </View>
          <Button type="outline" isFullWidth style={{ gap: 10 }}>
            <IconButton name="logo-google" />
            Continue with Google
          </Button>
          <Text color="muted" style={{ textAlign: "center" }}>
            Forgot password?
          </Text>
        </View>
        <Text color="muted" style={styles.bottomText}>
          Don't have an account?{" "}
          <Text weight="bold" onPress={() => router.replace("/signup")}>
            Sign Up.
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  formContainer: {
    gap: 12,
  },
  input: {
    width: "100%",
  },
  separatorContainer: {
    justifyContent: "center",
  },
  separatorText: {
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
  },
  bottomText: {
    textAlign: "center",
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
});
