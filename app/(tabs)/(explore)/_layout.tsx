import { Stack } from "expo-router";

import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="explore" options={{ headerShown: false }} />
      <Stack.Screen name="chat" />
      <Stack.Screen name="job-post" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
