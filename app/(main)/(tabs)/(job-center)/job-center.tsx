import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { JobsCenterHeader } from "@/components/headers/Headers";
import { Href, Link } from "expo-router";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import Separator from "@/components/ui/Separator";
import { useFeedHeight } from "@/components/posts/Feed";

export default function JobCenterScreen() {
  const themeColor = useThemeColor();
  const contentHeight = useFeedHeight();
  const { user } = useAuthData();
  const { data, isLoading } = trpc.post.get_active_post_counts.useQuery({
    user_uuid: user?.id!,
  });

  const [scrollY] = useState(new Animated.Value(0)); // Track scroll position

  if (!user || isLoading || !data) {
    return (
      <>
        <JobsCenterHeader />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>Error encountered</Text>
          </View>
        )}
      </>
    );
  }

  // Interpolate opacity of the image based on scrollY position
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200], // Adjust when the opacity changes
    outputRange: [1, 0], // Fades out as the user scrolls
    extrapolate: "clamp",
  });

  // Parallax effect: Opacity and translation of the header based on scrollY
  const parallaxHeaderTranslate = scrollY.interpolate({
    inputRange: [0, 300], // Adjust to control when it disappears
    outputRange: [0, -100], // Moves up as the user scrolls
    extrapolate: "clamp", // Prevents the view from moving too far
  });

  const parallaxHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 150], // Adjust when the opacity changes
    outputRange: [1, 0], // Fades out as the user scrolls
    extrapolate: "clamp",
  });

  return (
    <>
      <JobsCenterHeader />
      <Animated.ScrollView
        style={[styles.screen]}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y); // Update scroll position
        }}
        scrollEventThrottle={16} // Update scroll position more frequently
      >
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: parallaxHeaderTranslate }],
              opacity: parallaxHeaderOpacity,
              backgroundColor: themeColor.background,
              borderWidth: 2,
              borderColor: themeColor.foreground,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("/transactions")}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                padding: 32,
              }}
            >
              <Text>
                Your{" "}
                <Text size="lg" style={{ fontFamily: "Lexend-bold" }}>
                  Hustle
                </Text>{" "}
                Balance
              </Text>

              <Text weight="semibold" size="4xl" style={{ marginTop: 4 }}>
                $0.00
              </Text>
              <Separator
                color="foreground"
                style={{ marginTop: 4, marginBottom: 6 }}
              />
              <Text size="sm">View transactions</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View
          style={[
            styles.categoryWrapper,
            {
              backgroundColor: themeColor.background,
              minHeight: contentHeight,
            },
          ]}
        >
          <Button
            isFullWidth
            style={{ marginBottom: 26, borderRadius: 999 }}
            onPress={() => router.push("/(main)/(external)/create-post")}
          >
            Create a post
          </Button>

          <View style={styles.category}>
            <Text size="xl" weight="semibold">
              Tracking
            </Text>
            <View style={{ gap: 10 }}>
              <LinkEntry
                iconName="briefcase-outline"
                title="Working"
                href="/track-working"
                active_count={data.active_working_count}
              />
              <LinkEntry
                iconName="calendar-outline"
                title="Hiring"
                href="/track-hiring"
                active_count={data.active_hiring_count}
              />
            </View>
          </View>
          <View style={styles.category}>
            <Text size="xl" weight="semibold">
              Activity
            </Text>
            <View style={{ gap: 10 }}>
              <LinkEntry
                iconName="add-circle-outline"
                title="Saved"
                href="/saved-jobs"
              />
              <LinkEntry
                iconName="time-outline"
                title="Recently viewed"
                href="/recently-viewed"
              />
              <LinkEntry
                iconName="people-outline"
                title="Following"
                href="/following"
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

type LinkEntryProps = {
  iconName: IconSymbolName;
  title: string;
  href: Href;
  active_count?: number;
};
function LinkEntry({ iconName, title, href, active_count }: LinkEntryProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={href} asChild>
      <TouchableOpacity activeOpacity={0.6}>
        <View style={[styles.entry, { borderColor }]}>
          <Icon name={iconName} size="xl" />
          <Text style={styles.entryText}>{title}</Text>
          {active_count && active_count > 0 ? (
            <Text color="green" weight="semibold" style={{ marginRight: 12 }}>
              • {active_count} active
            </Text>
          ) : null}

          <Icon name="chevron-forward" size="xl" />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  categoryWrapper: {
    padding: 16,
  },
  category: {
    marginBottom: 34,
    gap: 10,
  },
  header: {
    borderRadius: 16,
    marginVertical: 16,
    marginHorizontal: "auto",
    width: 320,
    height: 200,
    justifyContent: "center",
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  entryText: {
    marginLeft: 12,
    marginRight: "auto",
  },
});
