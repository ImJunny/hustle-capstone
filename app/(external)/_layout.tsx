import "react-native-reanimated";
import { Stack } from "expo-router";

/*
  This is the layout for external routes which are those that do not 
  belong specifically to a stack in (tabs). These routes do not display 
  the tab bar because they do not belong in (tabs), which is intentional.
*/
export default function Layout() {
  return (
    <Stack screenOptions={{ animation: "default", headerShown: false }}>
      <Stack.Screen name="chat" />
      <Stack.Screen name="job-post" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
