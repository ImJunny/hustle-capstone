import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import LoadingView from "@/components/ui/LoadingView";
import ProfileSection from "@/components/profile/ProfileSection";
import { ProfileHeader } from "@/components/headers/Headers";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { Post } from "@/server/actions/post-actions";
import Separator from "@/components/ui/Separator";
import { useLocalSearchParams } from "expo-router";
import ProfileCard from "@/components/profile/ProfileCard";
import { useAuthData } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useFollowedStore } from "@/hooks/useFollowedStore";

export default function ProfileScreen() {
  const { user } = useAuthData();
  const { uuid } = useLocalSearchParams();

  const { data, error, isLoading } = trpc.user.get_user_data.useQuery({
    uuid: user?.id!,
    their_uuid: uuid as string,
  });

  const {
    data: posts,
    isLoading: postsLoading,
    refetch,
  } = trpc.post.get_user_posts.useQuery({
    uuid: uuid as string,
  });

  const jobPosts = posts?.filter((post) => post.type === "work");
  const servicePosts = posts?.filter((post) => post.type === "hire");

  const setFollowed = useFollowedStore((state) => state.setFollowed);
  const isFetched = useFollowedStore((state) =>
    state.fetched.has(uuid as string)
  );
  const setFetched = useFollowedStore((state) => state.setFetched);

  useEffect(() => {
    if (data) {
      if (!isFetched) {
        setFollowed(uuid as string, data.is_following);
        setFetched(uuid as string);
      }

      const timeout = setTimeout(() => {
        setFollowed(uuid as string, data.is_following);
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [data?.is_following, uuid]);

  if (error) {
    return (
      <View>
        <Text>User not found.</Text>
      </View>
    );
  }

  if (isLoading || postsLoading || !isFetched) {
    return <LoadingView />;
  }
  if (!posts || posts.length === 0) {
    return (
      <>
        <ProfileHeader username={data?.username ?? ""} />
        <ProfileCard data={data as unknown as UserData} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text weight="semibold" size="2xl">
            No data to show
          </Text>
          <Text>Create a post or complete jobs</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <ProfileHeader username={data?.username!} />
      <ScrollView refetch={refetch}>
        <View color="base">
          <ProfileCard data={data as unknown as UserData} />
          <View>
            {jobPosts && jobPosts.length > 0 && (
              <ProfileSection
                title="Jobs I need help with"
                type="work"
                posts={jobPosts as unknown as Post[]}
              />
            )}
            <Separator />
            {servicePosts && servicePosts.length > 0 && (
              <ProfileSection
                title="Services I provide"
                type="hire"
                posts={servicePosts as unknown as Post[]}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
