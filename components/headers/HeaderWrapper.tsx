import React from "react";
import View, { ViewProps } from "../ui/View";
import { StatusBar } from "react-native";
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
  const paddingTop = StatusBar.currentHeight || 0;
  const borderColor = useThemeColor().border as TColors;

  return (
    <View
      style={[
        {
          paddingTop,
          borderColor,
          height: 56 + paddingTop,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            position: "absolute",
            marginTop: paddingTop,
            marginInline: "auto",
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          {options.center}
        </View>
        <View
          style={{
            marginRight: "auto",
          }}
        >
          {options.left}
        </View>
        <View
          style={{
            marginLeft: "auto",
          }}
        >
          {options.right}
        </View>
      </View>
    </View>
  );
}
