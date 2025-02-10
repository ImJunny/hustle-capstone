import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet } from "react-native";
import RecentSuggestion from "@/components/explore/RecentSuggestion";

const recents = [
  { id: 1, recent: "Technology" },
  { id: 2, recent: "Health" },
  { id: 3, recent: "Finance" },
  { id: 4, recent: "Education" },
];

export default function ExploreScreen() {
  return (
    <>
      <View style={styles.recentSavedRow}>
        <View style={[styles.recentRow, styles.selectedTab]}>
          <Text size="xl" weight="semibold" color="white">
            Recent
          </Text>
        </View>
        <View style={styles.savedRow}>
          <Text
            size="xl"
            weight="semibold"
            color="muted"
            onPress={() => router.push("/explore-saved")}
          >
            Saved
          </Text>
        </View>
      </View>
      <View>
        {recents.map((suggestion, i) => (
          <RecentSuggestion key={i} recent={suggestion.recent} style={{}} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  recentSavedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  recentRow: {
    marginHorizontal: 16,
    padding: 6,
  },
  savedRow: {
    padding: 6,
  },
  selectedTab: {
    borderBottomWidth: 5,
    borderColor: "white",
  },
});
