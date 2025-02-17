import { SimpleHeader } from "@/components/headers/Headers";
import TrackWorkPost from "@/components/posts/TrackWorkPost";
import ScrollView from "@/components/ui/ScrollView";
import { exampleJobPosts } from "@/server/utils/example_data";

export default function TrackWorkingScreen() {
  const samplePosts = exampleJobPosts;
  return (
    <>
      <SimpleHeader title="Track working" />
      <ScrollView>
        {samplePosts.map((post, i) => (
          <TrackWorkPost key={i} data={post} style={{ borderBottomWidth: 1 }} />
        ))}
      </ScrollView>
    </>
  );
}
