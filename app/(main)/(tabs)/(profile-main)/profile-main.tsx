import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { StyleSheet } from "react-native";
import ScrollView from "@/components/ui/ScrollView";
import LoadingView from "@/components/ui/LoadingView";
import ProfileSection from "@/components/profile/ProfileSection";
import { ProfileSelfHeader } from "@/components/headers/Headers";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { Post } from "@/server/actions/post-actions";
import ProfileCard from "@/components/profile/ProfileCard";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProfileMainScreen() {
  const { user, geocode } = useAuthData();
  if (!user?.id) return;
  const { data, error, isLoading } = trpc.user.get_user_data.useQuery({
    uuid: user.id,
  });

  const {
    data: posts,
    isLoading: postsLoading,
    refetch,
  } = trpc.post.get_user_posts.useQuery({
    uuid: user.id,
    geocode: geocode ?? undefined,
  });
  const jobPosts = posts?.filter((post) => post.type === "work");
  const servicePosts = posts?.filter((post) => post.type === "hire");

  if (!data || error || !posts || isLoading || postsLoading) {
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
      <ProfileSelfHeader username={data?.username!} />
      <ScrollView refetch={refetch}>
        <ProfileCard data={data as unknown as UserData} isSelf />
        {posts?.length == 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              marginVertical: "auto",
              height: "100%",
            }}
          >
            <Text weight="semibold" size="2xl">
              No data to show
            </Text>
            <Text>Create a post or complete jobs</Text>
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
              <ProfileSection
                title="Services I provide"
                type="hire"
                posts={servicePosts as unknown as Post[]}
              />
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}
