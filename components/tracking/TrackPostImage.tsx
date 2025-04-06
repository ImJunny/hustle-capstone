import React from "react";
import { StyleSheet } from "react-native";
import View from "../ui/View";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import { Image } from "expo-image";
import Icon from "../ui/Icon";

export type TrackPostImageProps = {
  data: TrackPostType;
  self?: boolean;
};

export default function TrackPostImage({ data, self }: TrackPostImageProps) {
  let { status_type } = data;
  const renderOverlay = () => {
    if (status_type === "complete" || status_type === "in progress") {
      return (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      );
    }
  };

  return (
    <View
      style={{
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri: data.image_url }}
        style={{ width: 80, height: 80, borderRadius: 4 }}
      />
      {renderOverlay()}
      {status_type === "in progress" ? (
        <Icon
          name="briefcase-outline"
          size="2xl"
          style={{ position: "absolute" }}
        />
      ) : status_type === "complete" || status_type === "paid" ? (
        <Icon name="checkmark" size="3xl" style={{ position: "absolute" }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 16,
  },
  entryContent: {
    flex: 1,
    alignSelf: "stretch",
  },
});
