import { Image } from "expo-image";
import Text from "../ui/Text";
import View from "../ui/View";
import { trpc } from "@/server/lib/trpc-client";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Skeleton from "../ui/Skeleton";
import { LinearGradient } from "expo-linear-gradient";
import StarDisplay from "../ui/StarDisplay";
import { format, isThisYear } from "date-fns";

export default function PostMessage({ uuid }: { uuid: string }) {
  const { data, isLoading, isFetchedAfterMount } =
    trpc.messages.get_post_message_info.useQuery({
      post_uuid: uuid,
    });

  function formatCustomDate(date: Date) {
    return isThisYear(date)
      ? format(date, "MMMM d")
      : format(date, "MMMM d, yyyy");
  }

  return (
    <View style={{ borderRadius: 16, overflow: "hidden" }} color="foreground">
      <TouchableOpacity
        onPress={() => router.push(`/post/${data?.uuid}`)}
        activeOpacity={0.8}
      >
        <Skeleton show={isLoading} colorMode="light">
          <Image
            source={{ uri: data?.image_url }}
            style={{ width: 240, height: 240 }}
          />
        </Skeleton>
        {!isLoading && (
          <LinearGradient
            colors={["rgb(0, 0, 0)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
          />
        )}

        <View style={{ position: "absolute", bottom: 10, left: 10 }}>
          <Text color="white" weight="semibold" size="2xl">
            ${data?.min_rate}
            {data?.max_rate && " - " + `$${data?.max_rate}`}
          </Text>
          <Text
            color="white"
            weight="semibold"
            size="xl"
            style={{ width: 220 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.title}
          </Text>
          <View style={{ marginTop: 6 }}>
            {data?.type === "work" ? (
              <Text weight="semibold">
                Due {formatCustomDate(new Date(data?.due_date as any))}
              </Text>
            ) : (
              <StarDisplay rating={4} count={1} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    left: 0,
    right: 0,
    height: 140,
    bottom: 0,
    position: "absolute",
  },
});
