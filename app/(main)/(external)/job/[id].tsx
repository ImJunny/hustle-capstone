import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useLocalSearchParams, useSegments } from "expo-router";
import { BackHeader } from "@/components/headers/Headers";

export default function JobPostScreen() {
  const { id } = useLocalSearchParams();
  return (
    <>
      <BackHeader />
      <View>
        <Text>Details for job with id: {id}</Text>
      </View>
    </>
  );
}
