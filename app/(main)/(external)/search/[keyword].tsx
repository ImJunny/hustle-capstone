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
import { Dispatch, SetStateAction, useRef, useState } from "react";
import FilterSheet from "@/components/explore/FilterSheet";
import SortSheet from "@/components/explore/SortSheet";

export default function SearchedPage() {
  const { keyword } = useLocalSearchParams();
  const MIN_CONSTANT = 10;
  const MAX_CONSTANT = 500;
  const postTypes = ["all", "work", "hire"];

  const [filters, setFilters] = useState<{
    type: "all" | "work" | "hire";
    min: number;
    max: number;
    sort: "asc" | "desc" | undefined;
  }>({
    type: postTypes[0] as "all" | "work" | "hire",
    min: MIN_CONSTANT,
    max: MAX_CONSTANT,
    sort: undefined,
  });

  const filterSetters = {
    setMin: (min: number) => setFilters((prev) => ({ ...prev, min })),
    setMax: (max: number) => setFilters((prev) => ({ ...prev, max })),
    setType: (type: "work" | "hire" | "all") =>
      setFilters((prev) => ({ ...prev, type })),
    setSort: (sort: "asc" | "desc" | undefined) =>
      setFilters((prev) => ({ ...prev, sort })),
  };

  const { data, isLoading } = trpc.post.get_posts_by_filters.useQuery({
    keyword: keyword as string,
    min_rate: filters.min,
    max_rate: filters.max,
    type: filters.type,
    sort: filters.sort,
  });

  // Sheet refs to open/close
  const filterSheetRef = useRef<BottomSheet>(null);
  const sortSheetRef = useRef<BottomSheet>(null);

  return (
    <>
      <SearchedHeader
        text={keyword as string}
        style={{
          borderBottomWidth: 0,
        }}
      />
      <ExploreMiniHeader
        filterSheetRef={filterSheetRef}
        sortSheetRef={sortSheetRef}
      />
      {isLoading ? (
        <LoadingView />
      ) : !data || data.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Text>No posts found matching those keywords and filters</Text>
        </View>
      ) : (
        <ScrollView>
          {data.map((post, i) => (
            <Post key={i} data={post as TPost} type={post.type} />
          ))}
        </ScrollView>
      )}

      <SortSheet
        sheetRef={sortSheetRef}
        sort={filters.sort}
        setSort={
          filterSetters.setSort as Dispatch<
            SetStateAction<"asc" | "desc" | undefined>
          >
        }
      />
      <FilterSheet
        sheetRef={filterSheetRef}
        filters={filters}
        filterSetters={filterSetters}
      />
    </>
  );
}
