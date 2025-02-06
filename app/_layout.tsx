import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as NavigationBar from "expo-navigation-bar";
import SafeAreaView from "@/components/ui/SafeAreaView";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/*
  This is the root layout which includes a stack from Expo Router.
  This determines the behavior of screens where (tabs) routes stack 
  logic is separate from (external) routes. This allows for customization 
  for both stacks like animation, headers, etc..
*/
export default function RootLayout() {
  const themeColor = useThemeColor();
  SystemUI.setBackgroundColorAsync(themeColor.background);
  NavigationBar.setBackgroundColorAsync(themeColor.background);

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

  /* 
    ThemeProvider sets theme colors of the app, but this is not the main
    colors used. The relevant colors can be found in the constants folder.
  */
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(external)" />
        </Stack>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
