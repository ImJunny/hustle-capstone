import React, { useEffect, useRef, useState } from "react";
import PostList from "@/components/posts/PostList";
import { exampleJobPosts } from "@/server/utils/example-data";
import { SimpleHeader } from "@/components/headers/Headers";
import { FlatList } from "react-native-gesture-handler";
import { trpc } from "@/server/lib/trpc-client";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { SimpleUserData } from "@/server/actions/user-actions";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AvatarImage from "@/components/ui/AvatarImage";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import StarDisplay from "@/components/ui/StarDisplay";
import FollowButton from "@/components/profile/FollowButton";
import { useFollowedStore } from "@/hooks/useFollowedStore";

export default function FollowingScreen() {
  const { user } = useAuthData();
  const {
    data,
    isLoading,
    error,
    dataUpdatedAt,
    isFetched,
    isFetchedAfterMount,
  } = trpc.user.get_following.useQuery({
    user_uuid: user?.id!,
  });

  const setFollowed = useFollowedStore((state) => state.setFollowed);
  const lastUpdated = useFollowedStore((state) => state.dataUpdatedAt);
  const setLastUpdated = useFollowedStore((state) => state.setDataUpdatedAt);

  useEffect(() => {
    if (isFetched && dataUpdatedAt !== lastUpdated) {
      data?.forEach((user) => setFollowed(user.uuid, true));
      setLastUpdated(dataUpdatedAt);
      useFollowedStore.setState({ fetchedFollowed: true });
    }
  }, [dataUpdatedAt, isFetched, data]);

  const fetchedFollowed = useFollowedStore((state) => state.fetchedFollowed);

  if (!user || isLoading || error || !fetchedFollowed) {
    return (
      <LoadingScreen
        data={data}
        loads={[isLoading, !fetchedFollowed]}
        errors={[error]}
        header={<SimpleHeader title="Users you're following" />}
      />
    );
  }

  if (data.length === 0)
    return (
      <>
        <SimpleHeader title="Users you're following" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No followed users</Text>
        </View>
      </>
    );
  return (
    <>
      <SimpleHeader title="Users you're following" />
      <FlatList
        data={data}
        renderItem={({ item }) => <User data={item} />}
        keyExtractor={(item) => item.uuid}
      />
    </>
  );
}

function User({ data }: { data: SimpleUserData }) {
  return (
    <View
      color="background"
      style={{ padding: 16, borderBottomWidth: 1, gap: 8 }}
    >
      <TouchableOpacity onPress={() => router.push(`/profile/${data.uuid}`)}>
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <AvatarImage url={data.avatar_url} size={64} />
          <View style={{ justifyContent: "center" }}>
            <Text weight="semibold" size="lg">
              {data.display_name}
            </Text>

            <Text>@{data.username}</Text>
            <View>
              <StarDisplay rating={4.5} count={5} />
            </View>
          </View>
          <FollowButton
            user_uuid={data.uuid}
            style={{ flex: 0, width: 100, marginLeft: "auto" }}
            invalidate={false}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
