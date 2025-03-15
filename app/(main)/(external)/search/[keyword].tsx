import ExploreMiniHeader from "@/components/explore/ExploreMiniHeader";
import { SearchedHeader } from "@/components/headers/Headers";
import Post from "@/components/posts/Post";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";
import { Post as TPost } from "@/server/actions/post-actions";
import "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import FilterSheet from "@/components/explore/FilterSheet";

export default function SearchedPage() {
  const { keyword } = useLocalSearchParams();
  const { data, isLoading } = trpc.post.get_posts_by_keyword.useQuery({
    keyword: keyword as string,
  });

  // Sheet ref to open/close
  const filterSheetRef = useRef<BottomSheet>(null);
  return (
    <>
      <SearchedHeader
        text={keyword as string}
        style={{
          borderBottomWidth: isLoading || !data || data.length === 0 ? 1 : 0,
        }}
      />
      {isLoading ? (
        <LoadingView />
      ) : !data || data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No posts matching those keywords</Text>
        </View>
      ) : (
        <>
          <ExploreMiniHeader filterSheetRef={filterSheetRef} />
          <ScrollView>
            {data.map((post, i) => (
              <Post key={i} data={post as TPost} type={post.type} />
            ))}
          </ScrollView>
        </>
      )}

      <FilterSheet sheetRef={filterSheetRef} />
    </>
  );
}
