import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { EmptyHeader } from "@/components/headers/Headers";

export default function ProfileMainScreen() {
  return (
    <>
      <EmptyHeader />
      <View>
        <Text>Profile Main</Text>
        <Button onPress={() => router.push("/settings")}>Settings123</Button>
      </View>
    </>
  );
}
