import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router, Stack, withLayoutContext } from "expo-router";
import { StyleSheet } from "react-native";
import { EmptyHeader, SearchedHeader } from "@/components/headers/Headers";

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import Icon from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const themeColor = useThemeColor();
  return (
    <>
      <SearchedHeader />
      <>
        <MaterialTopTabs
          screenOptions={{
            tabBarActiveTintColor: themeColor.muted,
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 16 },
            tabBarIndicatorStyle: { backgroundColor: "#FFFFFF", height: 3 },
          }}
        >
          <MaterialTopTabs.Screen
            name="searched-jobs"
            options={{ title: "Jobs" }}
          />
          <MaterialTopTabs.Screen
            name="searched-services"
            options={{ title: "Services" }}
          />
          <MaterialTopTabs.Screen
            name="searched-users"
            options={{ title: "Users" }}
          />
        </MaterialTopTabs>
      </>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
