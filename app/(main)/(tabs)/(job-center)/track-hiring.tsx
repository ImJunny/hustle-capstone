import { SimpleHeader } from "@/components/headers/Headers";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { TrackHiringPost as TrackHiringPostType } from "@/server/actions/jobs-actions";
import TrackHiringPost from "@/components/posts/TrackHiringPost";

export default function TrackHireScreen() {
  const { user } = useAuthData();

  const { data, isLoading } = trpc.job.get_track_hiring_posts.useQuery({
    user_uuid: user?.id!,
  });

  if (!user || isLoading) {
    return (
      <>
        <SimpleHeader title="Track hiring" />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>Error encountered while getting posts</Text>
          </View>
        )}
      </>
    );
  }

  if (data?.length === 0) {
    return (
      <>
        <SimpleHeader title="Track hiring" />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>No jobs to track</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Track hiring" />
      <ScrollView>
        {data?.map((post, i) => (
          <TrackHiringPost
            key={i}
            data={post as TrackHiringPostType}
            style={{
              borderBottomWidth: 1,
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
