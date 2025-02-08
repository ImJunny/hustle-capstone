import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";

export default function SignUpScreen() {
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
          <Input placeholder="Email" style={styles.input} />
          <Input placeholder="Username" style={styles.input} />
          <Input placeholder="Password" style={styles.input} />
          <Button isFullWidth onPress={() => router.replace("/(main)/(tabs)")}>
            Sign Up
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
        </View>
        <Text color="muted" style={styles.bottomText}>
          Already have an account?{" "}
          <Link href="/signin" replace>
            <Text weight="bold">Sign In.</Text>
          </Link>
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
