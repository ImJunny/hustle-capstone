import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Slot />
    // <Stack>
    //   <Stack.Screen name="jobs" options={{ headerShown: false }} />
    //   <Stack.Screen name="chat" />
    //   <Stack.Screen name="job-post" />
    //   <Stack.Screen name="profile" />
    // </Stack>
  );
}
