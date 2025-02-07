import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(external)/example" options={{ animation: "none" }} />
      <Stack.Screen
        name="(external)/settings"
        options={{ animation: "ios_from_right" }}
      />
    </Stack>
  );
}
