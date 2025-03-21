import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { StyleSheet } from "react-native";
import ScrollView from "@/components/ui/ScrollView";
import LoadingView from "@/components/ui/LoadingView";
import ProfileSelfCard from "@/components/profile/ProfileSelfCard";
import ProfileSection from "@/components/profile/ProfileSection";
import { ProfileSelfHeader } from "@/components/headers/Headers";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { Post } from "@/server/actions/post-actions";

export default function ProfileMainScreen() {
  const { user } = useAuthData();
  if (!user?.id) return;
  const { data, error, isLoading } = trpc.user.get_user_data.useQuery({
    uuid: user.id,
  });
  const { data: posts, isLoading: postsLoading } =
    trpc.post.get_user_posts.useQuery({
      uuid: user.id,
    });
  const jobPosts = posts?.filter((post) => post.type === "work");
  const servicePosts = posts?.filter((post) => post.type === "hire");

  if (error) {
    return (
      <View>
        <Text>User not found.</Text>
      </View>
    );
  }

  if (isLoading || postsLoading) {
    return <LoadingView />;
  }
  if (!posts || posts.length === 0) {
    return (
      <>
        <ProfileSelfHeader username={data?.username ?? ""} />
        <ProfileSelfCard data={data as unknown as UserData} />
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
      <ProfileSelfHeader username={data?.username ?? ""} />
      <ScrollView color="background">
        <ProfileSelfCard data={data as unknown as UserData} />
        <View style={styles.contentContainer}>
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

          {/* <TouchableOpacity style={styles.completedContainer}>
            <Text size="xl" weight="semibold">
              Completed • 0
            </Text>
            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 16,
  },
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});
