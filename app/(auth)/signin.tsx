import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import Separator from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/server/lib/supabase";
import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

// form schema for input validation
const schema = z.object({
  email: z.string().email("Must be an email."),
  password: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const platform = Platform.OS;
  // declare form properties
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const themeColor = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);

  async function signInWithEmail() {
    setIsLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: getValues("email"),
      password: getValues("password"),
    });
    if (error) {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
      setIsLoading(false);
    }
    if (user) {
      router.replace("/(main)/(tabs)");
      Toast.show({
        text1: `Successfully signed in`,
        swipeable: false,
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container} color="background">
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
          <View style={styles.inputEntry}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && <Text color="red">{errors.email.message}</Text>}
          </View>
          <View style={styles.inputEntry}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
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
                    value={value}
                    onChangeText={onChange}
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
              )}
            />
            {errors.password && (
              <Text color="red">{errors.password.message}</Text>
            )}
          </View>

          <Button
            isFullWidth
            onPress={handleSubmit(signInWithEmail)}
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

          <GoogleSignInButton />

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
  inputEntry: {
    gap: 4,
  },
});
