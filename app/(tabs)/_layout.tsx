import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import Icon from "@/components/ui/Icon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].foreground,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          href: "/(tabs)/(home)",
          title: "Home",
          tabBarIcon: ({ color }) => <Icon name="home" size="xl" />,
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Icon name="search" size="xl" />,
        }}
      />
      <Tabs.Screen
        name="(jobs)"
        options={{
          title: "Job Center",
          tabBarIcon: ({ color }) => (
            <Icon name="calendar-clear-outline" size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(messages)"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <Icon name="chatbox-outline" size="xl" />,
        }}
      />
      <Tabs.Screen
        name="(profile-main)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle-outline" size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile-main))/chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(profile-main))/job-post"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(profile-main))/profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
