import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";
import { router } from "expo-router";
import Input from "../ui/Input";

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
        center: <Text>Middle</Text>,
        right: (
          <IconButton
            name="information-circle-outline"
            size="xl"
            onPress={() => router.push("/example")}
          />
        ),
      }}
    />
  );
}

export function JobsHeader() {
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

export function EmptyHeader() {
  return <HeaderWrapper />;
}

export function ExploreHeader() {
  return (
    <HeaderWrapper
      options={{
        center: (
          <Input
            placeholder="Search users, jobs, messages, etc..."
            style={{ width: "100%" }}
          />
        ),
      }}
    />
  );
}

export function SearchingHeader() {
  return (
    <HeaderWrapper
      options={{
        center: (
          <Input
            placeholder="Search users, jobs, messages, etc..."
            style={{ width: "80%" }}
          />
        ),
        left: (
          <IconButton
            name="arrow-back"
            size="2xl"
            onPress={() => router.back()}
          />
        ),
        right: (
          <IconButton
            name="ellipsis-vertical"
            size="xl"
            onPress={() => router.push("/example")}
          />
        ),
      }}
    />
  );
}
export function SearchedHeader() {
  return (
    <HeaderWrapper
      options={{
        center: (
          <Input
            placeholder="Searched"
            style={{ width: "90%", marginLeft: 50 }}
          />
        ),
        left: (
          <IconButton
            name="arrow-back"
            size="2xl"
            onPress={() => router.back()}
          />
        ),
      }}
    />
  );
}
