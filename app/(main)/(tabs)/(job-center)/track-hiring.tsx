import { SimpleHeader } from "@/components/headers/Headers";
import TrackHirePost from "@/components/posts/TrackHirePost";
import ScrollView from "@/components/ui/ScrollView";
import { exampleJobPosts } from "@/server/utils/example-data";

export default function TrackHiringScreen() {
  const samplePosts = exampleJobPosts;
  return (
    <>
      <SimpleHeader title="Track hiring" />
      <ScrollView>
        {samplePosts.map((post, i) => (
          <TrackHirePost
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
