import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(external)/settings"
        options={{ animation: "ios_from_right" }}
      />
      <Stack.Screen
        name="(external)/job/[id]"
        options={{ animation: "fade_from_bottom" }}
      />
    </Stack>
  );
}
