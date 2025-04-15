import { SimpleHeader } from "@/components/headers/Headers";
import Post from "@/components/posts/Post";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { Post as TPost } from "@/server/actions/post-actions";
import Text from "@/components/ui/Text";

export default function ReportedPostsScreen() {
  const { user, geocode } = useAuthData();
  const { data, isLoading, error, refetch } =
    trpc.report.get_reported_posts.useQuery({
      user_uuid: user?.id as string,
      geocode: geocode ?? undefined,
    });

  if (!data || isLoading || error) {
    return (
      <LoadingScreen
        data={data}
        loads={isLoading}
        errors={error}
        header={<SimpleHeader title="Reported posts" />}
      />
    );
  }

  if (data.length === 0) {
    return (
      <>
        <SimpleHeader title="Reported posts" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No reported posts</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Reported posts" />
      <ScrollView refetch={refetch}>
        {data.map((post, i) => (
          <Post key={i} data={post as TPost} />
        ))}
      </ScrollView>
    </>
  );
}
