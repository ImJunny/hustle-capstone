import { Tabs } from "expo-router";
import React from "react";
import Icon from "@/components/ui/Icon";
import TabBar from "@/components/navigation/TabBar";

/* 
  Tab bar elements are based off files in the (tabs) directory. 
  This convention is provided by Expo Router. The default tab bar 
  is overridden by a custom component called TabBar.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "home" : "home-outline"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "search" : "search-outline"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="(job-center)"
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
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size="xl"
              flippedX
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile-main"
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
