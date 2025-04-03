import CommentsSheet from "@/components/posts/CommentsSheet";
import Text from "@/components/ui/Text";
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(external)/edit-post/[uuid]"
          options={{ animation: "ios_from_right" }}
        />
        <Stack.Screen
          name="(external)/choose-address"
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="(external)/message/[uuid]"
          options={{ animation: "ios_from_right" }}
        />
        <Stack.Screen
          name="(external)/accept/[uuid]"
          options={{ animation: "ios_from_right" }}
        />
        <Stack.Screen
          name="(external)/post/[uuid]"
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="(external)/choose-service"
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="(external)/choose-worker"
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="(external)/choose-payment"
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="(external)/confirm-approval"
          options={{ animation: "ios_from_right" }}
        />
      </Stack>
      <CommentsSheet />
    </>
  );
}
