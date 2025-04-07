import { StyleSheet, Easing } from "react-native";
import View from "../ui/View";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TrackingProgressBar({
  progress,
}: {
  progress: "approved" | "in progress" | "complete";
}) {
  const themeColor = useThemeColor();
  const progressMap = {
    approved: 0.33,
    "in progress": 0.66,
    complete: 1,
  };

  const targetProgress = progressMap[progress];

  const animatedWidth = useRef(
    new Animated.Value(progressMap["approved"])
  ).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: targetProgress,
      duration: 500,
      easing: Easing.inOut(Easing.ease), // Apply easing function here
      useNativeDriver: false,
    }).start();
  }, [targetProgress]);

  const barWidthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
          <Animated.View
            style={[
              styles.barInner,
              {
                width: barWidthInterpolated,
                backgroundColor: themeColor.foreground,
              },
            ]}
          />
        </View>

        <View style={styles.checkContainer}>
          {[0.165, 0.5, 0.835].slice(0, checkmarkCount).map((threshold, i) => {
            const opacity = animatedWidth.interpolate({
              inputRange: [0, threshold, threshold + 0.15],
              outputRange: [0, 0, 1],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.checkmarkContainer,
                  {
                    left: `${threshold * 100}%`,
                    transform: [{ translateX: -20 }],
                    opacity,
                  },
                ]}
              >
                <View style={[styles.checkmarkBackdrop]} color="background" />
                <Icon name="checkmark-circle" size="2xl" />
              </Animated.View>
            );
          })}
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
    borderRadius: 999,
  },
  checkContainer: {
    position: "absolute",
    width: "100%",
  },
  checkmarkContainer: {
    position: "absolute",
    bottom: -20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBackdrop: {
    width: 20,
    height: 20,
    borderRadius: 999,
    position: "absolute",
  },
});
