import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { EmptyHeader } from "@/components/headers/Headers";
import { supabase } from "@/server/lib/supabase";

export default function ProfileMainScreen() {
  return (
    <>
      <EmptyHeader />
      <View>
        <Text>Profile Main</Text>
        <Button onPress={() => router.push("/settings")}>Settings</Button>
        <Button
          onPress={() => {
            supabase.auth.signOut();
            router.replace("/signin");
            console.log("Signed out.");
          }}
        >
          Sign out
        </Button>
      </View>
    </>
  );
}
