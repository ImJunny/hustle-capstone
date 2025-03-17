import View from "@/components/ui/View";
import React from "react";
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
      <View color="background">
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
