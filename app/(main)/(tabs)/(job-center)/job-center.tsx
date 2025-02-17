import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { JobsCenterHeader } from "@/components/headers/Headers";
import { Href, Link } from "expo-router";
import { router } from "expo-router";

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
            href="/track-working"
            active_count={2}
          />
          <LinkEntry
            iconName="calendar-outline"
            title="Hiring"
            href="/track-hiring"
          />
        </View>
        <View style={styles.category}>
          <Text size="xl" weight="semibold">
            Activity
          </Text>
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
          <Button
            isFullWidth
            style={{ marginTop: 16 }}
            onPress={() => router.push("/(main)/(external)/create-post")}
          >
            Create a post
          </Button>
        </View>
      </View>
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
      <TouchableOpacity>
        <View style={[styles.entry, { borderColor }]}>
          <Icon name={iconName} size="xl" />
          <Text style={styles.entryText}>{title}</Text>
          {active_count && (
            <Text color="green" weight="semibold" style={{ marginRight: 12 }}>
              • {active_count} active
            </Text>
          )}

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
