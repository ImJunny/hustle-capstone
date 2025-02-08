import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";
import { router } from "expo-router";
import Input from "../ui/Input";
import View from "../ui/View";

export function ExampleHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <Text
            weight="semibold"
            size="2xl"
            style={{
              fontFamily: "Lexend-bold",
            }}
          >
            Hustle
          </Text>
        ),
        right: (
          <IconButton
            name="filter"
            size="xl"
            onPress={() => router.push("/example")}
          />
        ),
      }}
    />
  );
}

export function JobsCenterHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <Text weight="semibold" size="xl">
            Job Center
          </Text>
        ),
        right: (
          <IconButton
            name="notifications-outline"
            size="xl"
            onPress={() => router.push("/example")}
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

export function SimpleHeader({ title }: { title: string }) {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              name="arrow-back"
              size="xl"
              onPress={() => router.back()}
            />
            <Text size="xl" weight="semibold">
              {title}
            </Text>
          </View>
        ),
      }}
    />
  );
}

export function EmptyHeader() {
  return <HeaderWrapper />;
}

export function ExploreHeader() {
  return (
    <HeaderWrapper
      options={{
        center: (
          <Input
            placeholder="Search users, services, jobs, etc..."
            style={{ width: "100%" }}
          />
        ),
      }}
    />
  );
}
