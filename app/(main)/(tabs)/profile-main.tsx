import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { EmptyHeader } from "@/components/headers/Headers";
import { supabase } from "@/server/lib/supabase";

export default function ProfileMainScreen() {
  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out: ", error.message);
    } else {
      router.replace("/signin");
      console.log("Signed out successfully");
    }
  }

  return (
    <>
      <EmptyHeader />
      <View>
        <Text>Profile Main</Text>
        <Button onPress={() => router.push("/settings")}>Settings</Button>
        <Button onPress={handleSignout}>Sign out</Button>
      </View>
    </>
  );
}
