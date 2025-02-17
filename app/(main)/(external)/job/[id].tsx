import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { DetailsHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Badge from "@/components/ui/Badge";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import {
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example_data";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PostScreen() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const { width } = Dimensions.get("window");

  const { id } = useLocalSearchParams();
  const post = [...exampleJobPosts, ...exampleServicePosts].find(
    (post) => post.uuid === id
  );

  if (!post) {
    return <Text>post not found</Text>;
  }
  return (
    <>
      <DetailsHeader />
      <ScrollView color="background">
        <ImagePlaceholder
          width={800}
          height={800}
          style={{ width, height: width }}
        />
        <View
          style={{
            padding: 16,
            borderColor,
            borderBottomWidth: 1,
          }}
        >
          <Text size="2xl" weight="semibold" style={{ marginVertical: 4 }}>
            {post.title}
          </Text>
          <Text weight="semibold" size="4xl">
            ${post.min_rate}
            {post.max_rate && "+"}
          </Text>
          <View style={styles.badgeRow}>
            <Badge>
              <Text
                style={{ textTransform: "uppercase" }}
                size="sm"
                weight="semibold"
              >
                {post.type}
              </Text>
            </Badge>
            <Badge>{post.distance}</Badge>
            {post.tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </View>
          <Text>{post.description}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 40,
            }}
          >
            <Text color="muted">Posted {post.time_ago}</Text>
            {post.type == "work" && (
              <Text color="muted">Due {post.due_date}</Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 16,
              paddingBottom: 16,
              width: "100%",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <IconButton name="add-circle-outline" size="2xl" />
            <IconButton name="chatbubble-outline" size="2xl" flippedX />
            <IconButton name="paper-plane-outline" size="2xl" />
            {post.type == "work" ? (
              <Button style={styles.pageButton}>Accept job</Button>
            ) : (
              <Button style={styles.pageButton}>Hire service</Button>
            )}
          </View>
        </View>
        {post.type == "hire" && (
          <View
            style={{
              padding: 16,
              borderColor,
              borderBottomWidth: 1,
            }}
          >
            <View style={{ marginTop: 16, marginBottom: 10 }}>
              <Text size="md" weight="semibold">
                Service Rating
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View>
                <Text size="3xl" weight="semibold">
                  4.5 out of 5
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 2,
                    marginVertical: 6,
                    alignItems: "center",
                  }}
                >
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star-half" />
                  <Text
                    weight="semibold"
                    style={{
                      marginLeft: 4,
                    }}
                  >
                    17 Reviews
                  </Text>
                </View>
              </View>
              <View style={styles.reviewButton}>
                <IconButton name="chevron-forward" size="2xl" />
              </View>
            </View>
          </View>
        )}

        <View
          style={{
            padding: 16,
          }}
        >
          <View style={{ marginTop: 16 }}>
            <Text size="md" weight="semibold">
              About the Employer
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
                <Text weight="semibold">{post.user_name}</Text>
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

          <Text
            ellipsizeMode="tail"
            style={{ marginVertical: 16, marginBottom: 16 }}
          >
            {post.description}
          </Text>
        </View>
      </ScrollView>
    </>
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
