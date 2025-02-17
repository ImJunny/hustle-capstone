import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { createUser } from "@/server/lib/user";
import { supabase } from "@/server/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignUpScreen() {
  const themeColor = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  // temporary sign up function; unsafe
  async function signUpWithEmail() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "com.hustle://auth/callback" },
      });

      if (error) throw error;
      if (session) {
        console.log("user registered as ", user?.id);
        if (user) {
          await createUser(
            user.id,
            email,
            username,
            firstName,
            lastName,
            new Date(user.created_at).toISOString()
          );
          router.replace("/(main)/(tabs)");
        }
      }
    } catch (error) {
      Alert.alert("Error", (error as AuthError)?.message);
    } finally {
      setIsLoading(false);
    }
  }

  // async function signUpWithEmail() {
  //   if (isLoading) return;

  //   setIsLoading(true);
  //   try {
  //     const {
  //       data: { session, user },
  //       error,
  //     } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: { emailRedirectTo: "com.hustle://auth/callback" },
  //     });

  //     if (error) throw error;
  //     if (!session) {
  //       Alert.alert("Please check your inbox for email verification.");
  //       console.log("user registered as ", user?.id);
  //       if (user) {
  //         await createUser(
  //           user.id,
  //           email,
  //           username,
  //           firstName,
  //           lastName,
  //           new Date(user.created_at).toISOString()
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", (error as AuthError)?.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Input
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text.toLocaleLowerCase())}
            autoCapitalize="none"
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
              hideOpacity
            />
          </View>
          <Button isFullWidth onPress={signUpWithEmail} disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
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
    </KeyboardAvoidingView>
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
