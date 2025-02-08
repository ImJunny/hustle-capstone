import { SimpleHeader } from "@/components/headers/Headers";
import JobPost from "@/components/posts/JobPost";
import ScrollView from "@/components/ui/ScrollView";
import { useLocalSearchParams } from "expo-router";

export default function PostListScreen() {
  const { postsType } = useLocalSearchParams();
  let formattedHeaderTitle = postsType as string;
  formattedHeaderTitle = formattedHeaderTitle.replaceAll("-", " ");
  formattedHeaderTitle =
    formattedHeaderTitle.charAt(0).toUpperCase() +
    formattedHeaderTitle.slice(1);

  const posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push(
      <JobPost
        key={`post-${i}`}
        postID={i}
        distance="< 5 mi"
        rate="50"
        tags={["home care"]}
        title="Home Cleaning"
        style={{
          borderBottomWidth: i != posts.length - 1 ? 1 : 0,
        }}
      />
    );
  }
  return (
    <>
      <SimpleHeader title={formattedHeaderTitle} />
      <ScrollView color="base" style={{ flex: 1 }}>
        {posts}
      </ScrollView>
    </>
  );
}
