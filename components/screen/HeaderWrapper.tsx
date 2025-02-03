import React from "react";
import View, { ViewProps } from "../ui/View";
import { Platform, StatusBar, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import SafeAreaView from "../ui/SafeAreaView";
import Text from "../ui/Text";

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
    <SafeAreaView {...props}>
      <View
        style={[
          { paddingTop, borderColor, height: 56 + paddingTop },
          styles.header,
          style,
        ]}
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
        <View
          style={{
            marginRight: "auto",
            justifyContent: "flex-end",
          }}
        >
          {options.left}
        </View>
        <View
          style={{
            marginLeft: "auto",
            justifyContent: "flex-end",
          }}
        >
          {options.right}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
});
