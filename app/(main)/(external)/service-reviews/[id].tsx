import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Review from "@/components/ui/Review";

export default function ReviewScreen() {
  return (
    <View>
      <Review displayImage={"user"} />
      <Text>ReviewScreen</Text>
    </View>
  );
}
