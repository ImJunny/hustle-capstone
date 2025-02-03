import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function ExploreScreen() {
  return (
    <View>
      <Text>Explore page/Search page!</Text>
      <Button onPress={() => router.push("/job-post")}>~Go to a job post~</Button>
    </View>
  );
}
