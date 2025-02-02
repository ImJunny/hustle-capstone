import { Tabs } from "expo-router";
import React from "react";
import Icon from "@/components/ui/Icon";
import TabBar from "@/components/ui/TabBar";
import HeaderWrapper from "@/components/ui/HeaderWrapper";
import ExampleHeader from "@/components/headers/ExampleHeader";

/* 
  Tab bar elements are based off files in the (tabs) directory. 
  This convention is provided by Expo Router. The default tab bar 
  is overridden by a custom component called TabBar.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: true }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="example"
        options={{
          title: "Example",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "help" : "help-outline"} size="xl" />
          ),
          header: () => <ExampleHeader />,
        }}
      />
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
        name="jobs"
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
            <Icon name={focused ? "chatbox" : "chatbox-outline"} size="xl" />
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
