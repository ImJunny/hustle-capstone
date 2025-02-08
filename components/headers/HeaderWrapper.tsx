import React from "react";
import View, { ViewProps } from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

type HeaderWrapperProps = {
  type?: "default" | "custom";
  options?: {
    left?: React.JSX.Element;
    center?: React.JSX.Element;
    right?: React.JSX.Element;
  };
  color?: TColors;
} & ViewProps;

export default function HeaderWrapper({
  type = "default",
  options = {},
  children,
  style,
  color = "background",
  ...props
}: HeaderWrapperProps) {
  const borderColor = useThemeColor().border as TColors;
  const themeColor = useThemeColor();

  return (
    <View
      style={[
        {
          borderColor,
          height: 66,
          borderBottomWidth: 1,
          paddingHorizontal: 16,
          backgroundColor: themeColor[color],
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
            marginInline: "auto",
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
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
