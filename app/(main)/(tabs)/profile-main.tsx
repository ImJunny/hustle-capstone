import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { EmptyHeader } from "@/components/headers/Headers";
import { supabase } from "@/server/lib/supabase";
import { getUserData } from "@/server/lib/user";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/headers/Headers";
import ProfileBio from "@/components/profile/profileBio";

export default function ProfileMainScreen() {
  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out: ", error.message);
    } else {
      router.replace("/signin");
      console.log("Signed out successfully");
      Toast.show({
        type: "info",
        text1: `Signed out`,
        swipeable: false,
        visibilityTime: 2000,
      });
    }
  }

  const { user } = useAuthData();
  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserData(user?.id ?? ""),
  });

  if (error) {
    return (
      <View>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <>
      <ProfileHeader />
      <View>
        <ProfileBio
          data={{
            uuid: "",
            bio: "",
            user_name: "John smith",
            name: "",
          }}
        />
        <View>
          <Text
            color="muted"
            style={{
              paddingHorizontal: 15,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation...
          </Text>
        </View>
      </View>
    </>
  );
}
