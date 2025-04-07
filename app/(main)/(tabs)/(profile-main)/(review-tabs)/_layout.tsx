import React from "react";
import { withLayoutContext } from "expo-router";
import { SimpleHeader } from "@/components/headers/Headers";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontSizes } from "@/constants/Sizes";

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
      <SimpleHeader title="Reviews" style={{ borderBottomWidth: 0 }} />
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: themeColor.background,
            borderBottomWidth: 1,
            borderColor: themeColor.border,
          },
          tabBarActiveTintColor: themeColor.muted,
          tabBarLabelStyle: {
            fontSize: FontSizes.md,
            fontFamily: "Inter-semibold",
          },
          tabBarIndicatorStyle: {
            backgroundColor: themeColor.foreground,
            height: 3,
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="received-reviews"
          options={{ title: "Received Reviews" }}
        />
      </MaterialTopTabs>
    </>
  );
}
