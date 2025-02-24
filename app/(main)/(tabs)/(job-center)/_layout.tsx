import React from "react";
import { Stack } from "expo-router";

export default function JobCenterLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="job-center" />
      <Stack.Screen name="(saved-tabs)" />
      <Stack.Screen name="recently-viewed" />
    </Stack>
  );
}
