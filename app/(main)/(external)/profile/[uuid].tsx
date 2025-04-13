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
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProfileScreen() {
  const { user, geocode } = useAuthData();
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
    geocode: geocode ?? undefined,
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

  if (!data || !posts || error || isLoading || postsLoading) {
    return (
      <LoadingScreen
        refetch={refetch}
        data={data}
        errors={[error]}
        loads={[isLoading, postsLoading]}
      />
    );
  }

  return (
    <>
      <ProfileHeader username={data?.username!} />
      <ScrollView refetch={refetch}>
        <ProfileCard data={data as unknown as UserData} />
        {posts?.length == 0 ? (
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
          </View>
        ) : (
          <View>
            {jobPosts && jobPosts.length > 0 && (
              <ProfileSection
                title="Jobs I need help with"
                type="work"
                posts={jobPosts as unknown as Post[]}
              />
            )}

            {servicePosts && servicePosts.length > 0 && (
              <>
                <Separator />
                <ProfileSection
                  title="Services I provide"
                  type="hire"
                  posts={servicePosts as unknown as Post[]}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}
