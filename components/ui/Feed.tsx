import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useRef, useState } from "react";
import Badge from "./Badge";
import IconButton from "./IconButton";
import ImageBackgroundPlaceholder from "./ImageBackgroundPlaceholder";
import Icon from "./Icon";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TJobPost } from "@/server/utils/example_data";

function Feed({ data }: { data: TJobPost }) {
  const { height: totalHeight } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const subtractedHeight = 66 + 56 + statusBarHeight;
  const newHeight = totalHeight - subtractedHeight;

  const {
    distance,
    min_rate,
    tags,
    title,
    uuid,
    max_rate,
    status,
    date,
    description,
    comments,
  } = data;
  return (
    <View style={[styles.feedContainer, { height: newHeight }]} color="black">
      <View
        style={{
          height: newHeight * 0.75,
        }}
      >
        <ImageBackgroundPlaceholder
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
                {title}
              </Text>
              <Text size="lg" color="white" weight="semibold">
                Due {date}
              </Text>
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.descriptionContainer}>
                <View style={styles.badgeRow}>
                  <Badge style={{ flexDirection: "row", gap: 2 }}>
                    <Text weight="semibold" size="sm">
                      $
                    </Text>
                    <Text weight="semibold" size="sm">
                      {min_rate}
                      {max_rate && "+"}
                    </Text>
                  </Badge>
                  <Badge>{distance}</Badge>
                  {tags.map((tag, i) => (
                    <Badge key={i}>{tag}</Badge>
                  ))}
                </View>
                <Text numberOfLines={3} ellipsizeMode="tail" color="muted-dark">
                  {description}
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
              {comments && (
                <Text
                  style={{ textAlign: "center", marginTop: 2 }}
                  weight="semibold"
                  color="white"
                >
                  {comments}
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
              John Smith
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
            onPress={() => router.push(`/job/${uuid}`)}
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

export default Feed;

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
    marginTop: 6,
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
