import { createStackNavigator } from "@react-navigation/stack";
// import { Stack } from "expo-router";

import "react-native-reanimated";
import ExploreScreen from "./explore";
import JobPostScreen from "../../job-post";
import ProfileScreen from "../../profile";
import ChatScreen from "../../chat";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Slot />
    // <Stack>
    //   <Stack.Screen name="explore" options={{ headerShown: false }} />
    //   <Stack.Screen name="chat" />
    //   <Stack.Screen name="job-post" options={{ headerShown: false }} />
    //   <Stack.Screen name="profile" />
    // </Stack>
  );

  // const Stack = createStackNavigator();
  // return (
  //   <Stack.Navigator>
  //     <Stack.Screen
  //       name="explore"
  //       component={ExploreScreen}
  //       options={{ headerShown: true }}
  //     />
  //     <Stack.Screen
  //       name="job-post"
  //       component={JobPostScreen}
  //       options={{ animation: "fade_from_right" }}
  //     />
  //     <Stack.Screen name="profile" component={ProfileScreen} />
  //     <Stack.Screen name="chat" component={ChatScreen} />
  //   </Stack.Navigator>
  // );
}
