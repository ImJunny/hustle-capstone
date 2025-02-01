import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat" />
      <Stack.Screen name="job-post" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
