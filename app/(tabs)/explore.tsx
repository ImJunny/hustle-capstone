import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text>Explore</Text>
      <Button onPress={() => router.push("/job-post")}>Go to a job post</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    paddingVertical: 20,
  },
});
