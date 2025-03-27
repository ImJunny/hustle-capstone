import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { Pressable, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { Image } from "expo-image";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "../ui/IconButton";

type PostDetailsAboutUserProps = {
  data: PostDetailsInfo;
};

export default function PostDetailsAboutUserSection({
  data,
}: PostDetailsAboutUserProps) {
  const { user } = useAuthData();
  return (
    <View
      color="background"
      style={{
        padding: 16,
      }}
    >
      <View style={{ marginTop: 16 }}>
        <Text size="md" weight="semibold">
          About the user
        </Text>
      </View>
      <Pressable
        onPress={() => {
          if (data.user_uuid === user?.id) {
            router.push("/profile-main");
          } else router.push(`/profile/${data.user_uuid}` as any);
        }}
      >
        <View style={styles.bottomContainer}>
          <Image
            source={
              data?.avatar_url
                ? {
                    uri: data.avatar_url,
                  }
                : require("@/assets/images/default-avatar-icon.jpg")
            }
            style={{ width: 40, height: 40, borderRadius: 999 }}
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

          <Button
            style={styles.messageButton}
            type="outline"
            borderColor="foreground"
            onPress={() => router.push(`/message/${data.user_uuid}`)}
          >
            Message
          </Button>
        </View>
      </Pressable>

      <Text
        ellipsizeMode="tail"
        style={{ marginVertical: 16, marginBottom: 16 }}
        color={data.user_bio ? "foreground" : "muted"}
      >
        {data.user_bio ?? "No bio provided"}
      </Text>
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
  },
  reviewButton: {
    marginLeft: "auto",
    marginTop: "auto",
  },
});
