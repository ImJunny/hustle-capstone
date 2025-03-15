import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Icon from "../ui/Icon";
import { supabase } from "@/server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { User } from "@supabase/supabase-js";
import { createUserReturn } from "@/server/actions/user-actions";

export default function GoogleSignInButton() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const [isLoading, setIsLoading] = useState(false);
  const createUserMutation = trpc.user.create_user.useMutation({
    onSuccess: async (data: createUserReturn) => {
      if (
        data?.onboarding_phase == null ||
        data?.onboarding_phase === "date of birth"
      )
        router.replace("/onboarding/date-of-birth");
      else if (data?.onboarding_phase === "first name")
        router.replace("/onboarding/first-name");
      else if (data?.onboarding_phase === "username")
        router.replace("/onboarding/username");
      else if (data?.onboarding_phase === "profile image")
        router.replace("/onboarding/profile-image");
      else if (data?.onboarding_phase === "completed")
        router.replace("/(main)/(tabs)");

      Toast.show({
        text1: `Successfully signed in`,
        swipeable: false,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
      setIsLoading(false);
    },
  });

  async function signInWithGoogle() {
    setIsLoading(true);

    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices();
    const { data, type } = await GoogleSignin.signIn();

    if (type === "success") {
      const {
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: data.idToken ?? "",
      });
      if (user && user.email) {
        createUserMutation.mutate({
          uuid: user.id,
          email: user.email,
        });
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="outline"
      isFullWidth
      style={{ gap: 10 }}
      onPress={signInWithGoogle}
      disabled={isLoading}
    >
      <Icon name="logo-google" size="xl" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}
