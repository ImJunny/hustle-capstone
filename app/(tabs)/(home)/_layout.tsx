import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Slot />
    // <Stack>
    //   <Stack.Screen name="index" options={{ headerShown: false }} />
    //   <Stack.Screen name="chat" options={{ animation: "slide_from_right" }} />
    //   <Stack.Screen
    //     name="job-post"
    //     options={{ animation: "slide_from_right" }}
    //   />
    //   <Stack.Screen
    //     name="profile"
    //     options={{ animation: "slide_from_right" }}
    //   />
    // </Stack>
  );
}
