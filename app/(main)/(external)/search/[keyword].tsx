import ExploreMiniHeader from "@/components/explore/ExploreMiniHeader";
import { SearchedHeader } from "@/components/headers/Headers";
import Post from "@/components/posts/Post";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";

export default function SearchedPage() {
  const { keyword } = useLocalSearchParams();
  const { data, isLoading } = trpc.post.get_posts_by_keyword.useQuery({
    keyword: keyword as string,
  });

  return (
    <>
      <SearchedHeader
        text={keyword as string}
        style={{
          borderBottomWidth: isLoading || !data || data.length === 0 ? 1 : 0,
        }}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : !data || data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No posts matching those keywords</Text>
        </View>
      ) : (
        <>
          <ExploreMiniHeader />
          <ScrollView>
            {data.map((post, i) => (
              <Post key={i} uuid={post.uuid} type={(post as any).type} />
            ))}
          </ScrollView>
        </>
      )}
    </>
  );
}
