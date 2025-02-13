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
      <EmptyHeader />
      <View>
        <Text>User username is {data?.username}</Text>
        <Text>User first name is {data?.first_name}</Text>
        <Text>User last name is {data?.last_name}</Text>
        <Button onPress={() => router.push("/settings")}>Settings</Button>
        <Button onPress={handleSignout}>Sign out</Button>
      </View>
    </>
  );
}
