import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function ProfileMainScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile Main</Text>
      <Button onPress={() => router.push("/settings")}>Settings</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    paddingVertical: 20,
  },
});
