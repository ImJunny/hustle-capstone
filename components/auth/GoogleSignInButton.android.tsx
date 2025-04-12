import React, { useState } from "react";
import { supabase } from "@/server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function GoogleSignInButtonAndroid() {
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  async function signInWithGoogle() {
    await GoogleSignin.signOut();
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { data, type } = await GoogleSignin.signIn();
      console.log(data?.idToken);
      if (type === "success") {
        const {
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: data.idToken!,
        });
        if (user && user.email)
          createUserMutation.mutate({
            uuid: user.id,
            email: user.email,
          });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Failed to sign in",
        type: "error",
        swipeable: false,
      });
      setLoading(false);
    }
  }
  const createUserMutation = trpc.user.create_user.useMutation({
    onSuccess: async (data) => {
      if (
        !data?.onboarding_phase ||
        data.onboarding_phase === "date of birth"
      ) {
        router.replace("/onboarding/date-of-birth");
      } else if (data.onboarding_phase === "username") {
        router.replace("/onboarding/username");
      } else if (data.onboarding_phase === "display name") {
        router.replace("/onboarding/display-name");
      } else if (data.onboarding_phase === "profile image") {
        router.replace("/onboarding/profile-image");
      } else {
        router.replace("/(main)/(tabs)");
      }

      Toast.show({
        text1: "Successfully signed in",
        swipeable: false,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
    },
  });

  return (
    <Button
      type="outline"
      isFullWidth
      style={{ gap: 10 }}
      onPress={signInWithGoogle}
      disabled={loading}
    >
      <Icon name="logo-google" size="xl" />
      {loading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}
