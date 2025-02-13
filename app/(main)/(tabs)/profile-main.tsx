import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { EmptyHeader } from "@/components/headers/Headers";
import { supabase } from "@/server/lib/supabase";
import { getUserInfo, UserInfo } from "@/server/lib/user";
import { useAuthInfo } from "@/contexts/AuthContext";

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

  const { user } = useAuthInfo();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    async function getUserFirstName() {
      if (user?.id) {
        const userInfo = (await getUserInfo(user.id)) as UserInfo;
        if (userInfo) {
          setFirstName(userInfo.first_name || "NULL");
        }
      }
    }

    getUserFirstName();
  }, []);

  return (
    <>
      <EmptyHeader />
      <View>
        <Text>User first name is {firstName}</Text>
        <Button onPress={() => router.push("/settings")}>Settings</Button>
        <Button onPress={handleSignout}>Sign out</Button>
      </View>
    </>
  );
}
