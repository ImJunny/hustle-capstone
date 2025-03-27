import { SimpleHeader } from "@/components/headers/Headers";
import TrackWorkingPost from "@/components/posts/TrackWorkingPost";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { TrackWorkingPost as TrackWorkingPostType } from "@/server/actions/jobs-actions";

export default function TrackWorkingScreen() {
  const { user } = useAuthData();

  const { data, isLoading } = trpc.job.get_track_working_posts.useQuery({
    user_uuid: user?.id!,
  });

  if (!user || isLoading) {
    return (
      <>
        <SimpleHeader title="Track working" />
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
        <SimpleHeader title="Track working" />
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
      <SimpleHeader title="Track working" />
      <ScrollView>
        {data?.map((post, i) => (
          <TrackWorkingPost
            key={i}
            data={post as TrackWorkingPostType}
            style={{
              borderBottomWidth: 1,
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
