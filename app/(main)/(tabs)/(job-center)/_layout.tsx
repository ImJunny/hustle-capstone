import React from "react";
import { Stack } from "expo-router";

export default function JobCenterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="job-center" />
      <Stack.Screen
        name="track-working"
        options={{ animation: "ios_from_right" }}
      />
      <Stack.Screen
        name="track-hiring"
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen name="(saved-tabs)" />
      <Stack.Screen name="recently-viewed" />
    </Stack>
  );
}
