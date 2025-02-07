import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function JobPostScreen() {
  return (
    <View>
      <Text>A job post</Text>
      <Button onPress={() => router.push("/profile")}>Go to a profile</Button>
    </View>
  );
}
