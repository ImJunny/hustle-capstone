import View from "../ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { router } from "expo-router";

export default function TrackCancelButton({
  initiated_uuid,
}: {
  initiated_uuid: string;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push(`/cancel-job?initiated_uuid=${initiated_uuid}`)
        }
      >
        <View style={[styles.entry]}>
          <Text style={styles.entryText}>Cancel job</Text>
          <Icon name="chevron-forward" size="xl" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  entryText: {
    marginRight: "auto",
  },
});
