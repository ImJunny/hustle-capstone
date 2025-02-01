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

import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import TabLayout from "./(tabs)/_layout";
import ExternalScreen from "./external";
import OtherScreen from "./other";
import * as SystemUI from "expo-system-ui";
SystemUI.setBackgroundColorAsync("black");
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        {/* <Stack.Screen
          name="external"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="other"
          options={{ animation: "slide_from_right" }}
        /> */}
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
  //         name="external"
  //         component={ExternalScreen}
  //         options={{ animation: "slide_from_right" }}
  //       />
  //       <Stack.Screen
  //         name="other"
  //         component={OtherScreen}
  //         options={{ animation: "slide_from_right" }}
  //       />
  //     </Stack.Navigator>
  //     <StatusBar style="auto" />
  //   </ThemeProvider>
  // );
}
