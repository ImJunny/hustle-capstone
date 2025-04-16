import View from "@/components/ui/View";
import React from "react";
import RecentSuggestion from "@/components/explore/RecentSuggestion";
import Text from "@/components/ui/Text";

const recents = [
  { id: 1, recent: "Technology" },
  { id: 2, recent: "Health" },
  { id: 3, recent: "Finance" },
  { id: 4, recent: "Education" },
];

export default function ExploreScreen() {
  return (
    <>
      <View color="background">
        <Text style={{ textAlign: "center", marginTop: 32 }}>
          To be implemented
        </Text>
        {/* {recents.map((suggestion, i) => (
          <RecentSuggestion
            key={suggestion.id}
            recent={suggestion.recent}
            style={{}}
          />
        ))} */}
      </View>
    </>
  );
}
