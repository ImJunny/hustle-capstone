import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

export default function JobsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.category}>
        <Text size="xl" weight="semibold">
          Your Posts
        </Text>
        <LinkEntry iconName="copy-outline" title="Job posts" />
        <LinkEntry iconName="copy-outline" title="Service posts" />
        <Button isFullWidth style={{ marginTop: 16 }}>
          Create a post
        </Button>
      </View>
      <View style={styles.category}>
        <Text size="xl" weight="semibold">
          Tracking
        </Text>
        <LinkEntry iconName="briefcase-outline" title="Working" />
        <LinkEntry iconName="calendar-outline" title="Hiring" />
      </View>
      <View style={styles.category}>
        <Text size="xl" weight="semibold">
          Activity
        </Text>
        <LinkEntry iconName="time-outline" title="Recently viewed" />
        <LinkEntry iconName="heart-outline" title="Liked" />
      </View>
    </View>
  );
}

type LinkEntryProps = {
  iconName: IconSymbolName;
  title: string;
};
function LinkEntry({ iconName, title }: LinkEntryProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.entry, { borderColor }]}>
      <Icon name={iconName} size="xl" />
      <Text style={styles.entryText}>{title}</Text>
      <IconButton name="chevron-forward" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
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
