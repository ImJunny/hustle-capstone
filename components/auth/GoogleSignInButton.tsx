import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { supabase } from "@/server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  });

  const createUserMutation = trpc.user.create_user.useMutation({
    onSuccess: async (data) => {
      if (!data?.onboarding_phase || data.onboarding_phase === "date of birth") {
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

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        supabase.auth.signInWithIdToken({
          provider: "google",
          token: authentication.idToken,
        }).then(({ data }) => {
          if (data?.user?.email) {
            createUserMutation.mutate({
              uuid: data.user.id,
              email: data.user.email,
            });
          }
        });
      }
    }
  }, [response]);

  return (
    <Button
      type="outline"
      isFullWidth
      style={{ gap: 10 }}
      onPress={()=>promptAsync()}
      disabled={!request}
    >
      <Icon name="logo-google" size="xl" />
      {request? "Signing in..." : "Continue with Google"}
    </Button>
  );
}
