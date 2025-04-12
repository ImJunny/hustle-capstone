import React from "react";
import View from "../ui/View";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import { Image } from "expo-image";
import Icon from "../ui/Icon";

export type TrackPostImageProps = {
  data: TrackPostType;
  self?: boolean;
};

export default function TrackPostImage({ data, self }: TrackPostImageProps) {
  let { status_type, progress } = data;

  const renderOverlay = () => {
    if (
      status_type === "complete" ||
      status_type === "in progress" ||
      progress === "in progress" ||
      progress === "complete" ||
      progress === "paid"
    ) {
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
        style={{ width: 90, height: 90, borderRadius: 4 }}
      />
      {renderOverlay()}
      {status_type === "in progress" ? (
        <Icon
          name="briefcase-outline"
          size="3xl"
          style={{ position: "absolute" }}
        />
      ) : status_type === "complete" ||
        progress === "complete" ||
        progress === "paid" ? (
        <Icon name="checkmark" size="4xl" style={{ position: "absolute" }} />
      ) : null}
    </View>
  );
}
