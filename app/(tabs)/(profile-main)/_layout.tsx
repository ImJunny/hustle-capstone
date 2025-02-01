import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Slot />
    // <Stack>
    //   <Stack.Screen name="profile-main" options={{ headerShown: false }} />
    // </Stack>
  );
}
