import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { useAuthData } from "@/contexts/AuthContext";
import Button from "../ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import Skeleton from "../ui/Skeleton";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

export default function PostDetailsFooter({ data }: { data: PostDetailsInfo }) {
  const { user } = useAuthData();
  const { param_type } = useLocalSearchParams();

  const { data: footerData, isLoading } =
    trpc.post.get_post_details_footer_info.useQuery({
      user_uuid: user?.id!,
      job_post_uuid: data.uuid!,
    });

  const [init, setInit] = useState(param_type ?? data.type);

  useEffect(() => {
    setInit((prev) => param_type ?? prev);
  }, [param_type]);
  const themeColor = useThemeColor();

  const renderButton = () => {
    if (
      init === "manage" ||
      data.user_uuid === user?.id ||
      (footerData?.initiated && param_type === undefined)
    ) {
      return (
        <Button
          style={{ marginLeft: "auto" }}
          type="outline"
          borderColor="foreground"
          onPress={() => {
            if (data.user_uuid === user?.id)
              router.push(`/track/hiring/${data.uuid}`);
            else router.push(`/track/working/${data.uuid}` as any);
          }}
        >
          Manage
        </Button>
      );
    } else if (init === "work") {
      return (
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button
            style={{ marginLeft: "auto" }}
            type="outline"
            borderColor="foreground"
            onPress={() => router.push(`/track/working/${data.uuid}` as any)}
          >
            Make offer
          </Button>
          <Button
            style={{ marginLeft: "auto" }}
            onPress={() => {
              router.push(`/accept/${data.uuid}` as any);
            }}
          >
            Accept job
          </Button>
        </View>
      );
    } else if (init === "hire") {
      return (
        <Button
          style={{ marginLeft: "auto" }}
          borderColor="foreground"
          onPress={() => {}}
        >
          Hire service
        </Button>
      );
    }
  };

  if (isLoading) {
    return (
      <View
        style={[styles.actionsRow, { borderColor: themeColor.border }]}
        color="background"
      >
        <View>
          <Skeleton show width={80} height={12} />
          <Skeleton width={80} height={26} />
        </View>
        <Skeleton show width={200} height={44} radius={8} />
      </View>
    );
  }

  return (
    <View
      style={[styles.actionsRow, { borderColor: themeColor.border }]}
      color="background"
    >
      <View>
        <Text size="sm" weight="semibold">
          Base rate
        </Text>
        <Text weight="semibold" size="xl">
          ${footerData?.min_rate}
          {footerData?.max_rate && " - " + `$${footerData?.max_rate}`}
        </Text>
      </View>
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
