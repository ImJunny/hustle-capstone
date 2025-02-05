import { Tabs } from "expo-router";
import React from "react";
import Icon from "@/components/ui/Icon";
import TabBar from "@/components/navigation/TabBar";
import { ExampleHeader, JobsHeader } from "@/components/headers/headers";
import HeaderWrapper from "@/components/headers/HeaderWrapper";

/* 
  Tab bar elements are based off files in the (tabs) directory. 
  This convention is provided by Expo Router. The default tab bar 
  is overridden by a custom component called TabBar.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: true, header: () => <HeaderWrapper /> }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "home" : "home-outline"} size="xl" />
          ),
          header: () => <ExampleHeader />,
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
          header: () => <JobsHeader />,
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
