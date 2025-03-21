import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(external)/edit-post/[uuid]"
        options={{ animation: "ios_from_right" }}
      />
    </Stack>
  );
}
