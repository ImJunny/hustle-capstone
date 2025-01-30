import { StyleSheet, ViewProps } from "react-native";
import View from "@/components/ui/View";

export default function Badge({ children, style }: ViewProps) {
  return (
    <View style={[styles.badgeContainer, style]} color="background-variant">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
});
