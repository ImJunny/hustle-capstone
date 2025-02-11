import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { JobsCenterHeader } from "@/components/headers/Headers";
import { Href, Link } from "expo-router";

export default function JobCenterScreen() {
  return (
    <>
      <JobsCenterHeader />
      <View style={styles.screen} color="background">
        <View style={styles.category}>
          <Text size="xl" weight="semibold">
            Tracking
          </Text>
          <LinkEntry
            iconName="briefcase-outline"
            title="Working"
            href="/posts-list/working"
          />
          <LinkEntry
            iconName="calendar-outline"
            title="Hiring"
            href="/posts-list/hiring"
          />
          <Button isFullWidth style={{ marginTop: 16 }}>
            Create a post
          </Button>
        </View>
        <View style={styles.category}>
          <Text size="xl" weight="semibold">
            Activity
          </Text>
          <LinkEntry
            iconName="heart-outline"
            title="Liked"
            href="/posts-list/liked"
          />
          <LinkEntry
            iconName="time-outline"
            title="Recently viewed"
            href="/posts-list/recently-viewed"
          />
        </View>
      </View>
    </>
  );
}

type LinkEntryProps = {
  iconName: IconSymbolName;
  title: string;
  href: Href;
};
function LinkEntry({ iconName, title, href }: LinkEntryProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={href} asChild>
      <TouchableOpacity>
        <View style={[styles.entry, { borderColor }]}>
          <Icon name={iconName} size="xl" />
          <Text style={styles.entryText}>{title}</Text>
          <Icon name="chevron-forward" size="xl" />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  category: {
    marginBottom: 34,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  entryText: {
    marginLeft: 12,
    marginRight: "auto",
  },
});
