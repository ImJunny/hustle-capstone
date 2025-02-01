import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="profile-main" options={{ headerShown: false }} />
      <Stack.Screen name="chat" />
      <Stack.Screen name="job-post" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
