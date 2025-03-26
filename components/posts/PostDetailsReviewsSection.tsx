import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PostDetailsReviewsSection() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View
      color="background"
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
