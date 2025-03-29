import React, { Dispatch, SetStateAction, useMemo } from "react";
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
  Image,
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
import ImagePlaceholder from "../ui/ImagePlaceholder";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/server/lib/supabase";

interface IndexHeaderProps {
  index: number;
  setIndex: (index: number) => void;
}

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

export function IndexHeader({ index, setIndex }: IndexHeaderProps) {
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
            <View>
              <Text
                weight="bold"
                size="xl"
                color="muted-dark"
                style={[styles.tabText, index === 0 && styles.activeTabText]}
                onPress={() => setIndex(0)}
              >
                Work
              </Text>
            </View>
            <View>
              <Text
                weight="bold"
                size="xl"
                color="muted-dark"
                style={[styles.tabText, index === 1 && styles.activeTabText]}
                onPress={() => setIndex(1)}
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
export function DetailsHeader() {
  return (
    <HeaderWrapper
      color="transparent"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
        borderBottomWidth: 0,
      }}
      options={{
        left: (
          <View style={{ borderRadius: 999, margin: 16 }} color="background">
            <IconButton
              name="arrow-back"
              onPress={() => router.back()}
              style={{ margin: 12 }}
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

export function ChooseAddressHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <Text size="xl" weight="semibold">
              Choose address
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

export function ChooseServiceHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <Text size="xl" weight="semibold">
              Link a service
            </Text>
          </View>
        ),
        right: (
          <IconButton
            name="add"
            onPress={() => router.push(`/create-post/?type=hire` as any)}
          />
        ),
      }}
    />
  );
}

export function ChooseWorkerHeader() {
  return (
    <HeaderWrapper
      options={{
        left: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <Text size="xl" weight="semibold">
              Approve a worker
            </Text>
          </View>
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
              pointerEvents="none"
              placeholder="Search users, jobs, services..."
              style={{ width: "100%" }}
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
    if (value.length > 0) router.back();
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
      width: 100,
    },
  });

  const { setValue, getValues } =
    useFormContext<z.infer<typeof CreatePostSchema>>();

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
                type={getValues("type") === "work" ? "primary" : "secondary"}
                onPress={() => setValue("type", "work")}
              >
                Job
              </Button>
              <Button
                style={styles.button}
                type={getValues("type") === "hire" ? "primary" : "secondary"}
                onPress={() => setValue("type", "hire")}
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

export function SingleMessageHeader({
  messenger,
  avatarUrl,
  user_uuid,
}: {
  messenger: string;
  avatarUrl: string | null;
  user_uuid: string;
}) {
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
        center: (
          <Pressable
            onPress={() => {
              router.push(`/profile/${user_uuid}`);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image
                source={
                  avatarUrl
                    ? {
                        uri: avatarUrl,
                      }
                    : require("@/assets/images/default-avatar-icon.jpg")
                }
                style={{ borderRadius: 999, width: 40, height: 40 }}
              />
              <Text weight="semibold" size="xl">
                {messenger}
              </Text>
            </View>
          </Pressable>
        ),
        right: <IconButton name="ellipsis-vertical" size="xl" />,
      }}
    />
  );
}

export function SingleMessageFooter({
  sender_uuid,
  receiver_uuid,
}: {
  sender_uuid: string;
  receiver_uuid: string;
}) {
  const utils = trpc.useUtils();
  const [text, setText] = useState("");
  const themeColor = useThemeColor();
  const channelName = [sender_uuid, receiver_uuid].sort().join(".");
  const channel = useMemo(() => supabase.channel(channelName), [channelName]);

  const { mutate: sendMessage, isLoading } =
    trpc.messages.send_text_message.useMutation({
      onSuccess: () => {
        utils.messages.get_message_previews.invalidate();
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          swipeable: false,
        });
      },
    });

  function handleSubmit() {
    if (!text.trim()) return;

    const newMessage = {
      chat_type: "text",
      sender_uuid,
      message: text,
      timestamp: new Date().toISOString(),
    };

    // Broadcast message to the channel
    channel.send({
      type: "broadcast",
      event: "message",
      payload: newMessage,
    });

    sendMessage({
      sender_uuid,
      receiver_uuid,
      message: newMessage.message,
    });

    setText("");
  }

  return (
    <HeaderWrapper
      style={{
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: themeColor.border,
      }}
      options={{
        center: (
          <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
            <Input
              placeholder="Send a message..."
              style={{ flexGrow: 1 }}
              value={text}
              onChangeText={(value) => setText(value)}
              onSubmitEditing={handleSubmit}
            />
            <IconButton
              name="send"
              size="xl"
              onPress={handleSubmit}
              disabled={isLoading || text === ""}
            />
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabText: {
    fontFamily: "Inter-bold",
  },
  activeTabText: {
    fontFamily: "Inter-bold",
    color: "white",
  },
});
