import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Icon from "../ui/Icon";
import { supabase } from "@/server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthError, User } from "@supabase/supabase-js";
import { Alert } from "react-native";

export default function GoogleButton() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const [isLoading, setIsLoading] = useState(false);
  const createUserMutation = trpc.user.create_user.useMutation({
    onSuccess: () => {},
    onError: () => console.log("Error creating"),
  });

  const [user, setUser] = useState<User | undefined>(undefined);
  async function signInWithGoogle() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const { data } = await GoogleSignin.signIn();
      if (data?.user) {
        const {
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: data.idToken ?? "",
        });
        if (user && user.email) {
          setUser(user);
          createUserMutation.mutate({
            uuid: user.id,
            email: user.email,
          });
        }
      } else throw new Error("Error signing in with Google.");
    } catch (error: any) {
      Alert.alert("Error", error);
      setIsLoading(false);
    }
  }

  const { data } = trpc.user.get_user_data.useQuery(
    { uuid: user?.id ?? "" },
    { enabled: !!user }
  );

  useEffect(() => {
    if (data) {
      router.push("/(main)/(tabs)");
      Toast.show({
        text1: `Signed in as @${data?.username}`,
        swipeable: false,
      });
    }
  }, [data]);

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
