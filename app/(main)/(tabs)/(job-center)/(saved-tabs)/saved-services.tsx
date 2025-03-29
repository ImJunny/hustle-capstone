import { useAuthData } from "@/contexts/AuthContext";
import SavedPostsSection from "@/components/posts/SavedPostsSection";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import { Post } from "@/server/actions/post-actions";

export default function SavedServicesScreen() {
  const { user } = useAuthData();
  const {
    data: savedServices,
    isLoading,
    error,
  } = trpc.post.get_saved_posts.useQuery({
    user_uuid: user?.id || "",
    type: "hire",
  });

  if (!user?.id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text weight="semibold" size="xl">
          Please log in to view saved services
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text weight="semibold" size="xl" style={{ color: "red" }}>
          Failed to load saved services
        </Text>
      </View>
    );
  }

  if (!savedServices || savedServices.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text weight="semibold" size="xl">
          No saved services found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <SavedPostsSection
        title="Saved Services"
        type="hire"
        posts={savedServices as Post[]}
      />
    </ScrollView>
  );
}
