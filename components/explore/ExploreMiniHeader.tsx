import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ExploreMiniHeader() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.spacing}>
        <Icon name="heart-sharp" size="lg" />
      </View>
      <View style={styles.spacing}>
        <Text size="lg" style={{ marginRight: 80 }}>
          Save this search
        </Text>
      </View>
      <View style={styles.spacing}>
        <Text size="lg">Sort</Text>
      </View>
      <View style={styles.spacing}>
        <Icon
          name="swap-vertical-outline"
          size="lg"
          style={{ marginRight: 20 }}
        />
      </View>
      <View style={styles.spacing}>
        <Text size="lg">Filter</Text>
      </View>
      <View style={styles.spacing}>
        <Icon name="filter" size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  spacing: {
    padding: 5,
  },
});
