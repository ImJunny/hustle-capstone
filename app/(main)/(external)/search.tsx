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
import SortSheet from "@/components/explore/SortSheet";
import { useAuthData } from "@/contexts/AuthContext";
import { safeJsonParse } from "@/utils/helpers";

export default function SearchedPage() {
  const { geocode: expoGeocode } = useAuthData();

  const {
    keyword,
    min_rate,
    max_rate,
    min_distance,
    max_distance,
    location_type,
    type,
    sort,
    geocode,
    tags,
  } = useLocalSearchParams();
  const geocodeArray = safeJsonParse<[number, number] | undefined>(
    geocode as string,
    undefined
  );
  const tagsArray = safeJsonParse<string[]>(tags as string, []);

  const { data, isLoading, refetch } = trpc.post.get_posts_by_filters.useQuery({
    keyword: keyword as string,
    min_rate: parseInt((min_rate as string) ?? "0"),
    max_rate: typeof max_rate === "string" ? parseInt(max_rate) : undefined,
    min_distance: parseInt((min_distance as string) ?? "0"),
    max_distance:
      typeof max_distance === "string" ? parseInt(max_distance) : 100000,
    location_type: (location_type as "all" | "remote" | "local") ?? undefined,
    type: (type as "all" | "work" | "hire") ?? undefined,
    sort:
      sort === "relevance"
        ? undefined
        : (sort as "asc-rate" | "desc-rate" | "asc-dist" | "desc-dist"),
    geocode: geocodeArray ?? expoGeocode ?? undefined,
    tags: tagsArray ?? [],
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
        <ScrollView refetch={refetch} showsVerticalScrollIndicator={true}>
          {data.map((post, i) => (
            <Post key={i} data={post as unknown as TPost} />
          ))}
        </ScrollView>
      )}

      <SortSheet sheetRef={sortSheetRef} />
      <FilterSheet sheetRef={filterSheetRef} />
    </>
  );
}
