import { createStackNavigator } from "@react-navigation/stack";
// import { Stack } from "expo-router";

import "react-native-reanimated";
import ExploreScreen from "./explore";
import JobPostScreen from "../(home,explore,jobs,messages,profile-main)/job-post";
import ProfileScreen from "../(home,explore,jobs,messages,profile-main)/profile";
import ChatScreen from "../(home,explore,jobs,messages,profile-main)/chat";
import ExternalScreen from "../../external";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="explore" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="job-post" />
      <Stack.Screen name="profile" />
    </Stack>
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
