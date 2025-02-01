import { StyleSheet } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Button from "@/components/ui/Button";
import { router } from "expo-router";

export default function TabTwoScreen() {
  return (
    <>
      <View>
        <Text>Explore</Text>
      </View>
      <Text>This app includes example code to help you get started.</Text>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{" "}
          library to create a waving hand animation.
        </Text>
      </Collapsible>
      <Button onPress={() => router.push("/job-post")}>Go to a job post</Button>
    </>
  );
}
