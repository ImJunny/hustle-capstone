import { SimpleHeader } from "@/components/headers/Headers";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import TrackPost from "@/components/posts/TrackPost";

export default function TrackHireScreen() {
  const { user } = useAuthData();

  const { data, isLoading } = trpc.job.get_track_hiring_posts.useQuery({
    user_uuid: user?.id!,
  });

  const sortedData = data?.sort((a, b) => {
    const progressOrder = [
      "in progress",
      "approved",
      "accepted",
      "complete",
      "paid",
    ];
    return (
      progressOrder.indexOf((a as any).progress) -
      progressOrder.indexOf((b as any).progress)
    );
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
        {sortedData?.map((post, i) => (
          <TrackPost
            key={i}
            data={post as TrackPostType}
            style={{
              borderBottomWidth: 1,
            }}
            type="hire"
            self
          />
        ))}
      </ScrollView>
    </>
  );
}
