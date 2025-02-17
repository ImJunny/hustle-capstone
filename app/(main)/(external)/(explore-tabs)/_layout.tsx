import React from "react";
import { withLayoutContext } from "expo-router";
import { SearchingHeader } from "@/components/headers/Headers";

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  return (
    <>
      <SearchingHeader />
      <>
        <MaterialTopTabs
          screenOptions={{
            tabBarActiveTintColor: "#C2C2C2",
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 16 },
            tabBarIndicatorStyle: { backgroundColor: "#FFFFFF", height: 3 },
          }}
        >
          <MaterialTopTabs.Screen
            name="explore-recent"
            options={{ title: "Recent" }}
          />
          <MaterialTopTabs.Screen
            name="explore-saved"
            options={{ title: "Saved" }}
          />
        </MaterialTopTabs>
      </>
    </>
  );
}
