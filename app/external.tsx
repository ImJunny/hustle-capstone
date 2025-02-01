import { StyleSheet } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Button from "@/components/ui/Button";
import { router } from "expo-router";

export default function ExternalScreen() {
  return (
    <View>
      <Text>External</Text>
      <Button onPress={() => router.push("/other")}>Go to other</Button>
    </View>
  );
}
