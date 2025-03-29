import { useAuthData } from "@/contexts/AuthContext";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import Post from "@/components/posts/Post";

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

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load saved services</Text>
      </View>
    );
  }

  if (!savedServices || savedServices.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No saved services found</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {savedServices.map((post, i) => (
        <Post key={post.uuid} data={post} type={post.type} />
      ))}
    </ScrollView>
  );
}
