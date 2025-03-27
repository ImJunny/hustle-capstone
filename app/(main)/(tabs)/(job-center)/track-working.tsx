import { SimpleHeader } from "@/components/headers/Headers";
import TrackJobPost from "@/components/posts/TrackJobPost";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { exampleJobPosts } from "@/server/utils/example-data";

export default function TrackWorkingScreen() {
  const samplePosts = exampleJobPosts;
  const { user } = useAuthData();

  const { data, isLoading } = trpc.job.get_track_job_posts.useQuery({
    user_uuid: user?.id!,
  });

  if (!user || isLoading) {
    return (
      <>
        <SimpleHeader title="Track working" />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>Error encountered while getting posts</Text>
          </View>
        )}
      </>
    );
  }
  return (
    <>
      <SimpleHeader title="Track working" />
      <ScrollView>
        {data?.map((post, i) => (
          <TrackJobPost
            key={i}
            data={post}
            style={{
              borderBottomWidth: 1,
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
