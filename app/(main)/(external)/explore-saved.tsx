import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import SavedSuggestion from "@/components/explore/SavedSuggestion";

const saves = [
  { id: 1, saved: "Technology", rate: "$100 >", distance: " < 20 mi" },
  { id: 2, saved: "Health", rate: "$50 >", distance: " remote" },
  { id: 3, saved: "Finance", rate: "< $75", distance: " < 10 mi" },
  { id: 4, saved: "Education", rate: "$150 >", distance: " < 15 mi" },
];

export default function ExploreScreen() {
  return (
    <>
      <View style={styles.recentSavedRow}>
        <View style={styles.recentRow}>
          <Text
            size="xl"
            weight="semibold"
            color="muted"
            onPress={() => router.push("/explore-recent")}
          >
            Recent
          </Text>
        </View>
        <View style={[styles.savedRow, styles.selectedTab]}>
          <Text size="xl" weight="semibold" color="white">
            Saved
          </Text>
        </View>
      </View>
      <View>
        {saves.map((suggestion, i) => (
          <SavedSuggestion
            key={suggestion.id}
            saved={suggestion.saved}
            rate={suggestion.rate}
            distance={suggestion.distance}
            style={{}}
          />
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
