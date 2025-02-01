import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Button from "@/components/ui/Button";
import { router } from "expo-router";

export default function ExploreScreen() {
  return (
    <View>
      <Text>Explore</Text>
      <Button onPress={() => router.push("/job-post")}>Go to job post</Button>
    </View>
  );
}
