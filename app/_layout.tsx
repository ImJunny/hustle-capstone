import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { Easing, useColorScheme } from "react-native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import TabLayout from "./(tabs)/_layout";
import * as SystemUI from "expo-system-ui";
import JobPostScreen from "./job-post";
import { useThemeColor } from "@/hooks/useThemeColor";
import ProfileScreen from "./profile";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const themeColor = useThemeColor();
  SystemUI.setBackgroundColorAsync(themeColor.background);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Lexend-bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Inter-normal": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-semibold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="job-post"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="profile"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );

  // const Stack = createStackNavigator();
  // return (
  //   <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         name="(tabs)"
  //         options={{ headerShown: false }}
  //         component={TabLayout}
  //       />
  //       <Stack.Screen
  //         name="job-post"
  //         component={JobPostScreen}
  //         options={{ animation: "slide_from_right" }}
  //       />
  //       <Stack.Screen
  //         name="profile"
  //         component={ProfileScreen}
  //         options={{ animation: "slide_from_right" }}
  //       />
  //     </Stack.Navigator>
  //     <StatusBar style="auto" />
  //   </ThemeProvider>
  // );
}
