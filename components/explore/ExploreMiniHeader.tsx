import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

export default function ExploreMiniHeader({
  filterSheetRef,
  sortSheetRef,
}: {
  filterSheetRef: React.RefObject<BottomSheetMethods>;
  sortSheetRef: React.RefObject<BottomSheetMethods>;
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <View style={[styles.container, { borderColor }]}>
      <TouchableOpacity style={styles.entry}>
        <Icon name="heart-outline" size="lg" />
        <Text size="lg" weight="semibold">
          Save this search
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.entry, { marginLeft: "auto", marginRight: 20 }]}
        onPress={() => sortSheetRef.current?.expand()}
      >
        <Text size="lg" weight="semibold">
          Sort
        </Text>
        <Icon name="swap-vertical-outline" size="lg" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.entry}
        onPress={() => filterSheetRef.current?.snapToPosition("100%")}
      >
        <Text size="lg" weight="semibold">
          Filter
        </Text>
        <Icon name="options" size="lg" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  entry: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
