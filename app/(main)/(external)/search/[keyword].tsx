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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import FilterSheet from "@/components/explore/FilterSheet";
import SortSheet from "@/components/explore/SortSheet";
import * as Location from "expo-location";

export default function SearchedPage() {
  const { keyword } = useLocalSearchParams();
  const MIN_CONSTANT = 10;
  const MAX_CONSTANT = 400;
  const postTypes = ["all", "work", "hire"];

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       return;
  //     }

  //     let { coords } = await Location.getCurrentPositionAsync({});
  //     console.log(coords);
  //   })();
  // }, []);

  const [filters, setFilters] = useState<{
    type: "all" | "work" | "hire";
    min: number;
    max: number;
    minDistance: number;
    maxDistance: number;
    sort: "asc" | "desc" | undefined;
    geocode: [number, number] | undefined;
  }>({
    type: postTypes[0] as "all" | "work" | "hire",
    min: MIN_CONSTANT,
    max: MAX_CONSTANT,
    minDistance: 0,
    maxDistance: 50,
    sort: undefined,
    geocode: undefined,
  });

  const filterSetters = {
    setMin: (min: number) => setFilters((prev) => ({ ...prev, min })),
    setMax: (max: number) => setFilters((prev) => ({ ...prev, max })),
    setMinDistance: (minDistance: number) =>
      setFilters((prev) => ({ ...prev, minDistance })),
    setMaxDistance: (maxDistance: number) =>
      setFilters((prev) => ({ ...prev, maxDistance })),
    setType: (type: "work" | "hire" | "all") =>
      setFilters((prev) => ({ ...prev, type })),
    setSort: (sort: "asc" | "desc" | undefined) =>
      setFilters((prev) => ({ ...prev, sort })),
    setGeocode: (lat: number, lng: number) =>
      setFilters((prev) => ({ ...prev, geocode: [lat, lng] })),
  };

  const { data, isLoading } = trpc.post.get_posts_by_filters.useQuery({
    keyword: keyword as string,
    min_rate: filters.min,
    max_rate: filters.max,
    min_distance: filters.minDistance,
    max_distance: filters.maxDistance,
    type: filters.type,
    sort: filters.sort,
    geocode: filters.geocode,
  });

  useEffect(() => {
    console.log(filters);
  }, [filters]);

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
            <Post key={i} data={post as unknown as TPost} type={post.type} />
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
      <FilterSheet sheetRef={filterSheetRef} filterSetters={filterSetters} />
    </>
  );
}
