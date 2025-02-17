import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "./Badge";
import IconButton from "./IconButton";
import Icon from "./Icon";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { HPost } from "@/server/utils/example_data";
import ImagePlaceholder from "./ImagePlaceholder";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HireFeed({ data }: { data: HPost }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const feedHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;

  return (
    <View style={[styles.feedContainer, { height: feedHeight }]} color="black">
      <View
        style={{
          height: feedHeight * 0.75,
        }}
      >
        <ImagePlaceholder
          width={800}
          height={800}
          style={{ width: "100%", height: "100%" }}
        />
        <LinearGradient
          colors={["rgb(0, 0, 0)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            left: 0,
            right: 0,
            height: 250,
            bottom: -2,
            position: "absolute",
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          bottom: 0,
          padding: 16,
          position: "absolute",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "flex-end" }}>
            <View style={styles.textContainer}>
              <Text
                style={{ marginVertical: 4 }}
                color="white"
                size="2xl"
                weight="semibold"
              >
                {data.title}
              </Text>
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.descriptionContainer}>
                <View style={styles.badgeRow}>
                  <Badge>
                    <Text
                      style={{ textTransform: "uppercase" }}
                      size="sm"
                      weight="semibold"
                    >
                      {data.type}
                    </Text>
                  </Badge>
                  <Badge>{data.distance}</Badge>
                  {data.tags.map((tag, i) => (
                    <Badge key={i}>{tag}</Badge>
                  ))}
                </View>
                <Text numberOfLines={3} ellipsizeMode="tail" color="muted-dark">
                  {data.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.iconButtonsContainer}>
            <IconButton
              name={"add-circle-outline"}
              style={styles.iconButton}
              color="white"
              size="2xl"
            />
            <View style={styles.iconButton}>
              <IconButton
                name={"chatbubble-outline"}
                color="white"
                size="2xl"
                flippedX
              />
              {data.comments && (
                <Text
                  style={{ textAlign: "center", marginTop: 2 }}
                  weight="semibold"
                  color="white"
                >
                  {data.comments}
                </Text>
              )}
            </View>

            <IconButton
              name={"paper-plane-outline"}
              style={styles.iconButton}
              color="white"
              size="2xl"
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View
            style={{ borderRadius: 999, width: 40, height: 40 }}
            color="muted"
          />
          <View style={styles.nameContainer}>
            <Text color="white" weight="semibold">
              {data.user_name}
            </Text>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Icon name={"star"} color="white"></Icon>
              <Text color="white" weight="semibold">
                4.5/5
              </Text>
            </View>
          </View>
          <Button
            style={styles.viewButton}
            onPress={() => router.push(`/job/${data.uuid}`)}
          >
            <Text color="black" weight="semibold">
              View
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default HireFeed;

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
  },
  textContainer: {},
  badgeSpace: {},
  descriptionContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  iconButton: { paddingBottom: 20 },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  iconButtonsContainer: {
    marginLeft: 20,
    marginTop: "auto",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20 },
  viewButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
});
