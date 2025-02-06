import { ImageBackground, StyleSheet, Dimensions } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "./Badge";
import IconButton from "./IconButton";
import ImageBackgroundPlaceholder from "./ImageBackgroundPlaceholder";
import Icon from "./Icon";
import Button from "./Button";

const { width, height } = Dimensions.get("window");
const contentHeight = height * 0.8; // 80% of the screen height

function Feed({ postData }) {
  return (
    <View style={styles.feedContainer}>
      <View style={{ height: contentHeight * 0.7 }}>
        <ImageBackgroundPlaceholder style={{ height: "100%", width: "100%" }}>
          <View style={styles.textContainer}>
            <Text style={{ marginVertical: 5 }} size="2xl">
              {postData.title}
            </Text>
            <Text size="md">Due {postData.date}</Text>
          </View>
        </ImageBackgroundPlaceholder>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.descriptionContainer}>
          <View style={{ flexDirection: "row", padding: 10 }}>
            {postData.tags.map((tag, i) => (
              <Badge style={styles.badgeSpace} key={"tag-" + i}>
                {tag}
              </Badge>
            ))}
          </View>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {postData.description}
          </Text>
        </View>
        <View style={styles.iconButtonsContainer}>
          <IconButton
            name={"heart-outline"}
            style={styles.iconButton}
          ></IconButton>
          <IconButton
            name={"share-outline"}
            style={styles.iconButton}
          ></IconButton>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Icon size="xxl" name={"person-circle-outline"} />
        <View style={styles.nameContainer}>
          <Text style={{ fontSize: 24 }}>{postData.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={"star-outline"} size="lg"></Icon>
            <Text style={{ marginHorizontal: 5, fontSize: 18 }}>
              {postData.rate}/5
            </Text>
          </View>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <Button style={styles.viewButton}>View</Button>
        </View>
      </View>
    </View>
  );
}

export default Feed;

const styles = StyleSheet.create({
  feedContainer: {
    height: contentHeight,
    width: width,
  },
  textContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "clear",
  },
  badgeSpace: {
    marginHorizontal: 5,
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    padding: 7.5,
    marginHorizontal: 2.5,
  },
  iconButton: {
    padding: 10,
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButtonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  nameContainer: {
    paddingLeft: 10,
  },
  viewButton: {
    fontSize: 24,
  },
});
