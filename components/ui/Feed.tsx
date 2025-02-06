import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "./Badge";
import IconButton from "./IconButton";
import ImageBackgroundPlaceholder from "./ImageBackgroundPlaceholder";
import Icon from "./Icon";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";

function Feed({ postData }: { postData: any }) {
  const { width, height: totalHeight } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const subtractedHeight = 57 + 57 + statusBarHeight;
  const newHeight = totalHeight - subtractedHeight;

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
          <View style={{ flex: 1 }}>
            <View style={styles.textContainer}>
              <Text
                style={{ marginVertical: 4 }}
                color="white"
                size="xl"
                weight="semibold"
              >
                {postData.title}
              </Text>
              <Text size="lg" color="white" weight="semibold">
                Due {postData.date}
              </Text>
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.descriptionContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    paddingBottom: 12,
                    marginTop: 10,
                  }}
                >
                  {postData.tags.map((tag: string, i: number) => (
                    <Badge style={styles.badgeSpace} key={"tag-" + i}>
                      {tag}
                    </Badge>
                  ))}
                </View>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={styles.description}
                  color="muted-dark"
                >
                  {postData.description}
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
            ></IconButton>
            <IconButton
              name={"paper-plane-outline"}
              style={styles.iconButton}
              color="white"
              size="2xl"
            ></IconButton>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View
            style={{ borderRadius: 999, width: 40, height: 40 }}
            color="muted"
          />
          <View style={styles.nameContainer}>
            <Text color="white" weight="semibold">
              {postData.name}
            </Text>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Icon name={"star"} color="white"></Icon>
              <Text color="white" weight="semibold">
                {postData.rating}/5
              </Text>
            </View>
          </View>
          <Button style={styles.viewButton}>
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
  description: {},
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
  },
  nameContainer: { marginLeft: 20 },
  viewButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
});
