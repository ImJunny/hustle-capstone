import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import TrackPost from "@/components/tracking/TrackPost";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function TrackHireScreen() {
  const { user } = useAuthData();

  const { data, isLoading, refetch, error } =
    trpc.job.get_track_hiring_posts.useQuery({
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

  if (!user || isLoading || error) {
    return (
      <LoadingScreen
        refetch={refetch}
        data={data}
        loads={isLoading}
        errors={[error]}
        header={<SimpleHeader title="Jobs you're hiring" />}
      />
    );
  }

  if (data?.length === 0) {
    return (
      <>
        <SimpleHeader title="Jobs you're hiring" />
        <ScrollView
          refetch={refetch}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No jobs to track</Text>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Jobs you're hiring" />
      <ScrollView refetch={refetch}>
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
