import React from "react";
import View from "../ui/View";
import Text from "../ui/Text";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon from "../ui/Icon";

export default function ProfileMiniCard() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.container, { borderColor }]} color="base">
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Icon name="briefcase" size="2xl" />
        <View style={{ alignItems: "center" }}>
          <Text weight="semibold" size="lg">
            5
          </Text>
          <Text weight="semibold" size="lg">
            Worked
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Icon name="calendar" size="2xl" />
        <View style={{ alignItems: "center" }}>
          <Text weight="semibold" size="lg">
            0
          </Text>
          <Text weight="semibold" size="lg">
            Hired
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    position: "absolute",
    width: "100%",
    bottom: -50,
    zIndex: 1,
    borderWidth: 1,
    height: 100,
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
