import React from "react";
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
import { StyleSheet } from "react-native";
import StarDisplay from "@/components/ui/StarDisplay";

export default function FollowingScreen() {
  const { user } = useAuthData();
  const { data, isLoading, error } = trpc.user.get_following.useQuery({
    user_uuid: user?.id!,
  });

  if (!user || !data || isLoading || error) {
    return (
      <LoadingScreen
        data={data}
        loads={[isLoading]}
        errors={[error]}
        header={<SimpleHeader title="Users I'm following" />}
      />
    );
  }

  if (data.length === 0)
    return (
      <>
        <SimpleHeader title="Users I'm following" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No followed users</Text>
        </View>
      </>
    );
  return (
    <>
      <SimpleHeader title="Users I'm following" />
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
        <View style={{ flexDirection: "row", gap: 20 }}>
          <AvatarImage url={data.avatar_url} size={70} />
          <View style={{ justifyContent: "center" }}>
            <Text weight="semibold" size="lg">
              {data.display_name}
            </Text>

            <Text>@{data.username}</Text>
            <View>
              <StarDisplay rating={4.5} count={5} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
