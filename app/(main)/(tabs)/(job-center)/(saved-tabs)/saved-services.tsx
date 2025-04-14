import { useAuthData } from "@/contexts/AuthContext";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import Post from "@/components/posts/Post";
import { Post as TPost } from "@/server/actions/post-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function SavedServicesScreen() {
  const { user } = useAuthData();
  const {
    data: savedServices,
    isLoading,
    error,
    refetch,
  } = trpc.post.get_saved_posts.useQuery({
    user_uuid: user?.id || "",
    type: "hire",
  });

  if (isLoading || error || !savedServices) {
    return (
      <LoadingScreen refetch={refetch} data={savedServices} loads={isLoading} />
    );
  }

  if (!savedServices || savedServices.length === 0) {
    return (
      <ScrollView
        refetch={refetch}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No saved services found</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView refetch={refetch}>
      {savedServices.map((post, i) => (
        <Post key={i} data={post as TPost} />
      ))}
    </ScrollView>
  );
}
