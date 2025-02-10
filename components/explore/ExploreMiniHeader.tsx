import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";

export default function ExploreMiniHeader() {
  return (
    <View style={styles.container}>
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
    borderWidth: 1,
    borderBottomColor: "#272727",
  },
  spacing: {
    padding: 5,
  },
});
