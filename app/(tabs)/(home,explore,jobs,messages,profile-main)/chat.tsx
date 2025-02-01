import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Button from "@/components/ui/Button";
import { router } from "expo-router";

export default function Chat() {
  return (
    <View>
      <Text>A chat room</Text>
      <Button onPress={() => router.push("/profile")}>Go to a profile</Button>
    </View>
  );
}
