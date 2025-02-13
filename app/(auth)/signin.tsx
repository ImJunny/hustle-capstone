import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/server/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function SignInScreen() {
  const themeColor = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  async function signInWithEmail() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) router.replace("/(main)/(tabs)");
    } catch (error) {
      Alert.alert("Error", (error as AuthError).message);
    } finally {
      setIsLoading(false);
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
            autoCapitalize="none"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: themeColor["background-variant"],
              borderRadius: 6,
            }}
          >
            <Input
              placeholder="Password"
              style={{ flexGrow: 1 }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
              secureTextEntry={passwordHidden}
            />
            <IconButton
              style={{ paddingHorizontal: 12 }}
              name={passwordHidden ? "eye-outline" : "eye"}
              onPress={() => setPasswordHidden(!passwordHidden)}
            />
          </View>

          <Button
            isFullWidth
            onPress={() => signInWithEmail()}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
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
          <Link href="/signup" replace>
            <Text weight="bold">Sign Up.</Text>
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
