import { getSavedPosts } from "@/server/actions/post-actions";
import { useAuthData } from "@/contexts/AuthContext";
import SavedPostsSection from "@/components/posts/SavedPostsSection";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";

export default async function SavedJobsScreen() {
  const session = await useAuthData();

  if (!session?.user?.id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text weight="semibold" size="xl">
          Please log in to view saved jobs
        </Text>
      </View>
    );
  }

  const savedJobs = await getSavedPosts(session.user.id, "work");

  return (
    <ScrollView>
      <SavedPostsSection title="Saved Jobs" type="work" posts={savedJobs} />
    </ScrollView>
  );
}
