import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="profile-main" />
      <Stack.Screen name="settings" options={{ animation: "ios_from_right" }} />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="reported-posts" />
    </Stack>
  );
}
