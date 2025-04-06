import { StyleSheet } from "react-native";
import View from "../ui/View";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { IconSizes } from "@/constants/Sizes";

export default function TrackingProgressBar({
  progress,
}: {
  progress: "approved" | "in progress" | "complete";
}) {
  const width =
    progress === "approved"
      ? "33%"
      : progress === "in progress"
      ? "66%"
      : "100%";
  const checkmarkCount =
    progress === "approved" ? 1 : progress === "in progress" ? 2 : 3;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <ProgressText text="Approved" value="approved" progress={progress} />
        <ProgressText
          text="In progress"
          value="in progress"
          progress={progress}
        />
        <ProgressText text="Completed" value="complete" progress={progress} />
      </View>
      <View style={styles.barContainer}>
        <View style={styles.barOuter} color="background-variant">
          <View style={[styles.barInner, { width }]} color="foreground" />
        </View>
        <View style={[styles.checkContainer, { width }]}>
          {[...Array(checkmarkCount)].map((_item, i) => (
            <View key={i} style={styles.checkmarkContainer}>
              <View style={[styles.checkmarkBackdrop]} color="background" />
              <Icon
                name="checkmark-circle"
                style={styles.checkmark}
                size="2xl"
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ProgressText({
  text,
  value,
  progress,
}: {
  text: string;
  value: "approved" | "in progress" | "complete";
  progress: "approved" | "in progress" | "complete";
}) {
  return (
    <Text
      weight="semibold"
      size="lg"
      style={{ marginHorizontal: "auto" }}
      color={progress === value ? "foreground" : "muted"}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  barContainer: {
    justifyContent: "center",
  },
  barOuter: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  barInner: {
    height: "100%",
  },
  checkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  checkmarkBackdrop: {
    width: 20,
    height: 20,
    borderRadius: 999,
    position: "absolute",
  },
  checkmark: { marginHorizontal: "auto" },
});
