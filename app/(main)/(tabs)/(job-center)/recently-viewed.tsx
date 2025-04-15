import PostList from "@/components/posts/PostList";
import { SimpleHeader } from "@/components/headers/Headers";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { Post as PostType } from "@/server/actions/post-actions";
import ScrollView from "@/components/ui/ScrollView";
import Post from "@/components/posts/Post";

export default function RecentlyViewedScreen() {
  const { user, geocode } = useAuthData();
  const { data, isLoading, error, refetch } =
    trpc.post.get_recently_viewed_posts.useQuery({
      user_uuid: user?.id as string,
      geocode: geocode ?? undefined,
    });

  if (!data || isLoading || error) {
    return (
      <LoadingScreen
        data={data}
        loads={isLoading}
        errors={error}
        header={<SimpleHeader title="Recently viewed" />}
      />
    );
  }

  if (data.length === 0) {
    return (
      <>
        <SimpleHeader title="Recently viewed" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No recently viewed posts</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Recently viewed" />
      <ScrollView refetch={refetch}>
        {data.map((post, i) => (
          <Post data={post as PostType} key={i} />
        ))}
      </ScrollView>
    </>
  );
}
