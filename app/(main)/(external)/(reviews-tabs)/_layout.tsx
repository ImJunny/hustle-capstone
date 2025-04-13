import React from "react";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { SimpleHeader } from "@/components/headers/Headers";

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { FontSizes } from "@/constants/Sizes";
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
  const { uuid } = useLocalSearchParams();

  return (
    <>
      <SimpleHeader title={"Reviews"} style={{ borderBottomWidth: 0 }} />
      <>
        <MaterialTopTabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: themeColor.background,
              borderBottomWidth: 1,
              borderColor: themeColor.border,
            },
            tabBarLabelStyle: {
              fontFamily: "Inter-semibold",
              fontSize: FontSizes.md,
            },
            tabBarActiveTintColor: themeColor.foreground,
            tabBarIndicatorStyle: {
              backgroundColor: themeColor.foreground,
              height: 3,
            },
          }}
        >
          <MaterialTopTabs.Screen
            name="employer-reviews"
            options={{ title: "From hirers" }}
            initialParams={{ uuid }}
          />
          <MaterialTopTabs.Screen
            name="worker-reviews"
            options={{ title: "From workers" }}
            initialParams={{ uuid }}
          />
        </MaterialTopTabs>
      </>
    </>
  );
}
