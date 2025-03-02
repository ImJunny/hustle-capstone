import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { Pressable, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { PostDetailsInfo } from "@/server/actions/post-actions";

type PostDetailsAboutUserProps = {
  data: PostDetailsInfo;
};

export default function PostDetailsAboutUserSection({
  data,
}: PostDetailsAboutUserProps) {
  return (
    <View
      style={{
        padding: 16,
      }}
    >
      <View style={{ marginTop: 16 }}>
        <Text size="md" weight="semibold">
          About the user
        </Text>
      </View>
      <Pressable onPress={() => router.push(`/profile/user`)}>
        <View style={styles.bottomContainer}>
          <ImagePlaceholder
            width={40}
            height={40}
            style={{ borderRadius: 999 }}
          />
          <View style={styles.nameContainer}>
            <Text weight="semibold">@{data.user_username}</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Icon name={"star"} />
              <Icon name={"star"} />
              <Icon name={"star"} />
              <Icon name={"star"} />
              <Icon name={"star"} />
              <Text style={{ marginLeft: 4 }} size="sm">
                1
              </Text>
            </View>
          </View>

          <Button style={styles.messageButton} type="variant">
            <Icon name="chatbubble-ellipses-outline" size="xl" flippedX />
            <Text weight="semibold">Message</Text>
          </Button>
        </View>
      </Pressable>

      {data.user_bio && (
        <Text
          ellipsizeMode="tail"
          style={{ marginVertical: 16, marginBottom: 16 }}
        >
          {data.user_bio}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  pageButton: {
    marginLeft: "auto",
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20 },
  messageButton: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 12,
  },
  reviewButton: {
    marginLeft: "auto",
    marginTop: "auto",
  },
});
