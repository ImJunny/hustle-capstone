import React from "react";
import HeaderWrapper from "../screen/HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";

export default function ExampleHeader() {
  return (
    <HeaderWrapper
      type="default"
      options={{
        left: (
          <Text
            weight="semibold"
            size="2xl"
            style={{ fontFamily: "Lexend-bold" }}
          >
            Hustle
          </Text>
        ),
        center: <Text>Middle</Text>,
        right: (
          <IconButton
            name="information-circle-outline"
            size="xl"
            onPress={() => alert("Information clicked!")}
          />
        ),
      }}
    />
  );
}
