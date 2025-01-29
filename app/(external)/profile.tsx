import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Button from "@/components/ui/Button";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <View>
      <Text>Someone's profile</Text>
      <Button onPress={() => router.push("/chat")}>Go to their chat</Button>
    </View>
  );
}
