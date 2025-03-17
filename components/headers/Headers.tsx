import React, { Dispatch, SetStateAction } from "react";
import HeaderWrapper from "./HeaderWrapper";
import Text from "../ui/Text";
import IconButton from "../ui/IconButton";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Input from "../ui/Input";
import View, { ViewProps } from "../ui/View";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Icon, { IconSymbolName } from "../ui/Icon";
import { useState } from "react";
import { useEffect } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../ui/Button";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { CreatePostSchema } from "@/zod/zod-schemas";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

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
        right: <IconButton name="filter" size="xl" />,
      }}
    />
  );
}

export function IndexHeader() {
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
        center: (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                borderBottomColor: "white",
                borderBottomWidth: 5,
              }}
            >
              <Text
                weight="bold"
                size="xl"
                style={{
                  fontFamily: "Inter-bold",
                }}
              >
                Work
              </Text>
            </View>
            <View>
              <Text
                weight="bold"
                size="xl"
                style={{
                  fontFamily: "Inter-bold",
                }}
              >
                Hire
              </Text>
            </View>
          </View>
        ),
        right: <IconButton name="filter" size="xl" />,
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
        right: <IconButton name="notifications-outline" size="xl" />,
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
export function DetailsHeader({
  sheetRef,
}: {
  sheetRef: React.RefObject<BottomSheetMethods>;
}) {
  return (
    <HeaderWrapper
      options={{
        left: <IconButton name="arrow-back" onPress={() => router.back()} />,
        right: (
          <View
            style={{
              flexDirection: "row",
              gap: 18,
            }}
          >
            <IconButton
              name="ellipsis-vertical"
              onPress={() => sheetRef.current?.expand()}
            />
          </View>
        ),
      }}
    />
  );
}

export function SimpleHeader({
  title,
  style,
}: {
  title: string;
} & ViewProps) {
  return (
    <HeaderWrapper
      style={style}
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
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

export function AddressesHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <Text size="xl" weight="semibold">
              Addresses
            </Text>
          </View>
        ),
        right: (
          <IconButton
            name="add"
            onPress={() => router.push("/create-address")}
          />
        ),
      }}
    />
  );
}

export function MessagesHeader() {
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
              placeholder="Search users, jobs, services..."
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
          <Pressable
            style={{ width: "100%" }}
            onPress={() => {
              router.push("/explore-recent");
            }}
          >
            <Input
              editable={false}
              placeholder="Search users, jobs, services..."
              style={{ width: "100%" }}
              onFocus={() => {}}
            />
          </Pressable>
        ),
      }}
    />
  );
}
export function SearchingHeader() {
  const { text } = useLocalSearchParams();
  const [value, setValue] = useState(text as string);

  async function handleSearch() {
    router.replace(`/search/${value}`);
  }
  return (
    <HeaderWrapper
      style={{ borderBottomWidth: 0 }}
      options={{
        center: (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconButton
              name="arrow-back"
              size="xl"
              onPress={() => router.back()}
            />
            <Input
              placeholder="Search users, jobs, services..."
              style={{ flex: 1 }}
              autoFocus
              value={value}
              onChangeText={(value) => setValue(value)}
              onSubmitEditing={handleSearch}
            />
            <IconButton name="ellipsis-vertical" size="xl" />
          </View>
        ),
      }}
    />
  );
}
export function SearchedHeader({
  text,
  style,
}: {
  text: string;
  style?: ViewStyle;
}) {
  return (
    <HeaderWrapper
      style={style}
      options={{
        center: (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 12,
            }}
          >
            <IconButton
              name="arrow-back"
              size="xl"
              onPress={() => router.back()}
            />
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                router.replace(`/explore-recent?text=${text}`);
              }}
            >
              <Input
                value={text}
                editable={false}
                placeholder="Search users, jobs, services..."
                style={{ width: "100%" }}
              />
            </Pressable>
          </View>
        ),
      }}
    />
  );
}

export function ProfileSelfHeader({ username }: { username: string }) {
  return (
    <HeaderWrapper
      options={{
        left: (
          <Text weight="semibold" size="xl">
            @{username}
          </Text>
        ),
        right: (
          <>
            <View
              style={{ gap: 16, flexDirection: "row", alignItems: "center" }}
            >
              <IconButton
                name="add"
                size="xl"
                onPress={() => router.push("/create-post")}
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

export function ProfileHeader({ username }: { username: string }) {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <Text size="xl" weight="semibold">
              @{username}
            </Text>
          </View>
        ),
        right: <IconButton name="ellipsis-vertical" />,
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

export function CreatePostHeader() {
  const styles = StyleSheet.create({
    button: {
      height: 40,
      width: 90,
    },
  });

  const { setValue } = useFormContext<z.infer<typeof CreatePostSchema>>();
  const [type, setType] = useState<"work" | "hire">("work");

  useEffect(() => {
    setValue("type", type);
  }, [type]);

  return (
    <HeaderWrapper
      options={{
        left: (
          <View
            style={{
              gap: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              name="arrow-back"
              size="xl"
              onPress={() => router.back()}
            />
            <View style={{ flexDirection: "row" }}>
              <Button
                style={styles.button}
                type={type === "work" ? "primary" : "secondary"}
                onPress={() => setType("work")}
              >
                Job
              </Button>
              <Button
                style={styles.button}
                type={type === "hire" ? "primary" : "secondary"}
                onPress={() => setType("hire")}
              >
                Service
              </Button>
            </View>
          </View>
        ),
      }}
    />
  );
}

export function ReviewHeader({ username }: { username: string }) {
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
            <Text weight="semibold" size="xl">
              Reviews for @{username}
            </Text>
          </View>
        ),
      }}
    />
  );
}
