import CommentsSheet from "@/components/posts/CommentsSheet";
import SharePostSheet from "@/components/posts/SharePostSheet";
import { Stack, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";

export default function Layout() {
  const segments = useSegments();
  const currentPath = segments.join("/");
  const [sheetsVisible, setSheetsVisible] = useState(true);
  useEffect(() => {
    setSheetsVisible(
      currentPath == "(main)/(tabs)" ||
        currentPath == "(main)/(external)/post/[uuid]"
    );
  }, [segments]);

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
          name="(external)/confirm-approval"
          options={{ animation: "ios_from_right" }}
        />
        <Stack.Screen
          name="(external)/cancel-job"
          options={{ animation: "ios_from_right" }}
        />
      </Stack>

      <CommentsSheet visible={sheetsVisible} />
      <SharePostSheet visible={sheetsVisible} />
    </>
  );
}
