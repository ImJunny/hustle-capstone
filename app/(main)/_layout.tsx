import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(external)/settings"
        options={{ animation: "ios_from_right" }}
      />
      <Stack.Screen
        name="(external)/job/[id]"
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name="(external)/track/working/[uuid]"
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name="(external)/track/hiring/[uuid]"
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name="(external)/edit-profile"
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name="(external)/profile/[uuid]"
        options={{ animation: "none" }}
      />
    </Stack>
  );
}
