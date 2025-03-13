import ExploreMiniHeader from "@/components/explore/ExploreMiniHeader";
import { SearchedHeader } from "@/components/headers/Headers";
import Post from "@/components/posts/Post";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Post as TPost } from "@/server/actions/post-actions";

export default function SearchedPage() {
  const { keyword } = useLocalSearchParams();
  const { data, isLoading } = trpc.post.get_posts_by_keyword.useQuery({
    keyword: keyword as string,
  });

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  function openBottomSheet() {
    if (bottomSheetRef.current) {
      console.log("Opening BottomSheet");
      bottomSheetRef.current.expand(); // Expand the sheet when button is pressed
    }
  }

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
          <ExploreMiniHeader />
          <ScrollView>
            {data.map((post, i) => (
              <Post key={i} data={post as TPost} type={post.type} />
            ))}
          </ScrollView>
          {/* <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={["25%", "50%", "90%"]}
            onChange={handleSheetChanges}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Test</Text>
            </View>
          </BottomSheet>

          <Button onPress={openBottomSheet}>Open</Button> */}
        </>
      )}
    </>
  );
}
