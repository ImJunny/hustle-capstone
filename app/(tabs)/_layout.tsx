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
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].foreground,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      })}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          href: "/(tabs)/(home)",
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "home" : "home-outline"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "chatbox" : "chatbox-outline"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(jobs)"
        options={{
          title: "Job Center",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "calendar-clear" : "calendar-clear-outline"}
              size="xl"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(messages)"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "chatbox" : "chatbox-outline"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile-main)"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "person-circle" : "person-circle-outline"}
              size="xl"
            />
          ),
        }}
      />
    </Tabs>
  );
}
