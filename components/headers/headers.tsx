import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";
import { router } from "expo-router";

export function ExampleHeader() {
  return (
    <HeaderWrapper
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

export function BackHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <IconButton
            name="arrow-back"
            size="xl"
            onPress={() => router.back()}
          />
        ),
      }}
    />
  );
}
