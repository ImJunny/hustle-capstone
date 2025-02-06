import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function ProfileMainScreen() {
  return (
    <View>
      <Text>Profile Main</Text>
      <Button onPress={() => router.push("/settings")}>Settings123</Button>
    </View>
  );
}
