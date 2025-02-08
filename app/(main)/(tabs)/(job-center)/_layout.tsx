import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="job-center" />
      <Stack.Screen
        name="posts-list/[postsType]"
        options={{ animation: "fade_from_bottom" }}
      />
    </Stack>
  );
}
