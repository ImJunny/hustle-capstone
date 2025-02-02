import React from "react";
import View, { ViewProps } from "./View";
import { Platform, StatusBar, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

type HeaderWrapperProps = {
  type?: "default" | "custom";
  options?: {
    left?: React.JSX.Element;
    center?: React.JSX.Element;
    right?: React.JSX.Element;
  };
} & ViewProps;

export default function HeaderWrapper({
  type = "default",
  options = {},
  children,
  style,
  ...props
}: HeaderWrapperProps) {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const paddingTop = Platform.OS === "android" ? statusBarHeight : 0;
  const borderColor = useThemeColor().border as TColors;

  return (
    <View
      style={[styles(paddingTop, borderColor).defaultHeader, style]}
      {...props}
    >
      <View
        style={{
          position: "absolute",
          marginTop: paddingTop,
          marginInline: "auto",
          bottom: 16,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        {options.center}
      </View>
      <View style={{ marginRight: "auto" }}>{options.left}</View>
      <View style={{ marginLeft: "auto" }}>{options.right}</View>
    </View>
  );
}

const styles = (paddingTop: number, borderColor: TColors) =>
  StyleSheet.create({
    defaultHeader: {
      paddingTop,
      height: 56 + paddingTop,
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 16,
      borderColor,
      borderBottomWidth: 1,
      paddingBottom: 16,
    },
  });
