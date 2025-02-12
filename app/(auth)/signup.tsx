import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { createUser } from "@/server/lib/database";
import { supabase } from "@/server/lib/supabase";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, AppState, StyleSheet } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignUpScreen() {
  const themeColor = useThemeColor();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert("Error", error.message);
    if (session) {
      router.push("/(main)/(tabs)");
      const result = createUser(
        session.user.id,
        email,
        username,
        firstName,
        lastName
      );
      console.log(result);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text
          size="4xl"
          style={{
            fontFamily: "Lexend-bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Hustle
        </Text>
        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Input
              placeholder="First"
              style={{ flex: 1 }}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <Input
              placeholder="Last"
              style={{ flex: 1 }}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
          <Input
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button isFullWidth onPress={() => signUpWithEmail()}>
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
