import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { StyleSheet } from "react-native";
import ScrollView from "@/components/ui/ScrollView";
import LoadingView from "@/components/ui/LoadingView";
import ProfileSection from "@/components/profile/ProfileSection";
import { ProfileHeader, ProfileSelfHeader } from "@/components/headers/Headers";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { Post } from "@/server/actions/post-actions";
import Separator from "@/components/ui/Separator";
import { useLocalSearchParams } from "expo-router";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfileScreen() {
  const { uuid } = useLocalSearchParams();
  const { data, error, isLoading } = trpc.user.get_user_data.useQuery({
    uuid: uuid as string,
  });
  const { data: posts, isLoading: postsLoading } =
    trpc.post.get_user_posts.useQuery({
      uuid: uuid as string,
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
      <ScrollView>
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
