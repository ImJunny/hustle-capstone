import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { useAuthData } from "@/contexts/AuthContext";
import Button from "../ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import Skeleton from "../ui/Skeleton";

export default function PostDetailsButton({ data }: { data: PostDetailsInfo }) {
  const { user } = useAuthData();
  const { param_type } = useLocalSearchParams();
  const { data: isInitiated, isLoading } = trpc.post.is_initiated.useQuery({
    user_uuid: user?.id!,
    job_post_uuid: data.uuid!,
  });

  const [init, setInit] = useState(param_type ?? data.type);
  useEffect(() => {
    setInit((prev) => param_type ?? prev);
  }, [param_type]);

  if (isLoading) {
    return <Skeleton show={isLoading} width={140} height={44} radius={8} />;
  } else if (
    init === "manage" ||
    data.user_uuid === user?.id ||
    (isInitiated && param_type === undefined)
  ) {
    return (
      <Button
        style={{ marginLeft: "auto" }}
        type="outline"
        borderColor="foreground"
        onPress={() => router.push(`/track/working/${data.uuid}` as any)}
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
}
