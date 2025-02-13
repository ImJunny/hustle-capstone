import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Platform, useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as NavigationBar from "expo-navigation-bar";
import SafeAreaView from "@/components/ui/SafeAreaView";
import { AuthProvider } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/ToastConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const themeColor = useThemeColor();
  const platform = Platform.OS;
  if (platform == "android") {
    SystemUI.setBackgroundColorAsync(themeColor.background);
    NavigationBar.setBackgroundColorAsync(themeColor.background);
  }

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

  const queryClient = new QueryClient();

  /* 
    ThemeProvider sets theme colors of the app, but this is not the main
    colors used. The relevant colors can be found in the constants folder.
  */
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(main)" />
              <Stack.Screen name="(auth)" />
            </Stack>
            <Toast config={toastConfig} />
          </SafeAreaView>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
