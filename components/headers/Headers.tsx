import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";
import { router } from "expo-router";
import Input from "../ui/Input";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";

export function ExampleHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <Text
            weight="semibold"
            size="3xl"
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

export function MessagesHeader() {
  const borderColor = useThemeColor().border;
  return (
    <View color="background">
      <HeaderWrapper
        style={{ borderBottomWidth: 0 }}
        options={{
          left: (
            <Text size="xl" weight="semibold">
              Messages
            </Text>
          ),
          right: <IconButton name="ellipsis-vertical" flippedX />,
        }}
      />
      <HeaderWrapper
        style={{ marginTop: -10 }}
        options={{
          center: (
            <Input
              placeholder="Search users, services, jobs..."
              style={{ width: "100%" }}
            />
          ),
        }}
      />
    </View>
  );
}

export function ExploreHeader() {
  return (
    <HeaderWrapper
      options={{
        center: (
          <Input
            placeholder="Search users, services, jobs..."
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

export function ProfileHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <Text weight="semibold" size="xl">
            @johnsmith
          </Text>
        ),
        right: (
          <>
            <View
              style={{ gap: 12, flexDirection: "row", alignItems: "center" }}
            >
              <IconButton
                name="add"
                size="xl"
                onPress={() => router.push("/example")}
              />
              <IconButton
                name="menu-sharp"
                size="xl"
                onPress={() => router.push("/settings")}
              />
            </View>
          </>
        ),
      }}
    />
  );
}

export function SettingsHeader() {
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
              Settings
            </Text>
          </View>
        ),
      }}
    />
  );
}
