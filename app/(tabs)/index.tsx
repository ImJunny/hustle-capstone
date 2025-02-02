import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";

export default function HomeScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
});
