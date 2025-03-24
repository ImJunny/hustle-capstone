import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { ReactNode, RefObject, useState } from "react";
import View from "../ui/View";
import Button from "../ui/Button";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import RangeSlider from "../ui/RangeSlider";
import Separator from "../ui/Separator";
import { trpc } from "@/server/lib/trpc-client";
import GoogleAutoInput from "../ui/GoogleAutoInput";

export default function FilterSheet({
  sheetRef,
  filterSetters,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  filterSetters: {
    setMin: (min: number) => void;
    setMax: (max: number) => void;
    setMinDistance: (minDistance: number) => void;
    setMaxDistance: (maxDistance: number) => void;
    setType: (type: "all" | "work" | "hire") => void;
    setGeocode: (lat: number, lng: number) => void;
  };
}) {
  const themeColor = useThemeColor();
  const postTypes: Array<"work" | "hire" | "all"> = ["all", "work", "hire"];
  const MIN_CONSTANT = 10;
  const MAX_CONSTANT = 400;

  const [type, setType] = useState<"all" | "work" | "hire">(
    postTypes[0] as "all" | "work" | "hire"
  );
  const [min, setMin] = useState(MIN_CONSTANT);
  const [max, setMax] = useState(MAX_CONSTANT);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);
  const [geocode, setGeocode] = useState<[number, number] | undefined>(
    undefined
  );

  const utils = trpc.useUtils();
  function handleSave() {
    filterSetters.setMin(min);
    filterSetters.setMax(max);
    filterSetters.setType(type);
    filterSetters.setMinDistance(minDistance);
    filterSetters.setMaxDistance(maxDistance);
    if (geocode) {
      const [lat, lng] = geocode;
      filterSetters.setGeocode(lat, lng);
    }
    utils.post.get_posts_by_filters.invalidate();
    sheetRef.current?.close();
  }

  function handleReset() {
    setMin(0);
    setMax(400);
    setType("all");
  }

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Filters"
      snapPoints={[1, "100%"]}
      enableContentPanningGesture={false}
    >
      <BottomSheetFlatList
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ gap: 50 }}
        renderItem={({ item }: { item: ReactNode }) => <>{item}</>}
        data={[
          <FilterEntry title="Type">
            <View style={{ flexDirection: "row", gap: 12 }}>
              {postTypes.map((postType, i) => (
                <Button
                  key={i}
                  style={styles.typeButton}
                  type={type === postType ? "primary" : "outline"}
                  onPress={() => setType(postType)}
                >
                  {postType === "all"
                    ? "All"
                    : postType === "work"
                    ? "Jobs"
                    : "Services"}
                </Button>
              ))}
            </View>
          </FilterEntry>,
          <Separator />,
          <View>
            <View style={styles.dualLabel}>
              <Text weight="semibold" size="xl">
                Rate
              </Text>
              <Text>
                {min === MIN_CONSTANT && max === MAX_CONSTANT
                  ? "Any"
                  : min === MIN_CONSTANT && max !== MAX_CONSTANT
                  ? `up to $${max}`
                  : min !== MIN_CONSTANT && max === MAX_CONSTANT
                  ? `$${min}+`
                  : `$${min} to $${max}`}
              </Text>
            </View>
            <RangeSlider
              minConstant={MIN_CONSTANT}
              maxConstant={MAX_CONSTANT}
              setMin={setMin}
              setMax={setMax}
              min={min}
              max={max}
              step={5}
            />
          </View>,
          <Separator />,
          <View style={{ gap: 20 }}>
            <FilterEntry title="Location type">
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button style={{ flex: 1 }}>All</Button>
                <Button style={{ flex: 1 }} type="outline">
                  Remote
                </Button>
                <Button style={{ flex: 1 }} type="outline">
                  Local
                </Button>
              </View>
            </FilterEntry>
            <GoogleAutoInput setGeocode={setGeocode} />
            <View>
              <View style={styles.dualLabel}>
                <Text weight="semibold" size="xl">
                  Distance
                </Text>
                <Text>
                  {minDistance === 0 && maxDistance === 50
                    ? "Any"
                    : minDistance === 0 && maxDistance !== 50
                    ? `up to ${maxDistance} mi`
                    : minDistance !== 0 && maxDistance === 50
                    ? `${minDistance} mi +`
                    : `${minDistance} - ${maxDistance} mi`}
                </Text>
              </View>
              <RangeSlider
                minConstant={0}
                maxConstant={50}
                setMin={setMinDistance}
                setMax={setMaxDistance}
                min={minDistance}
                max={maxDistance}
                step={5}
              />
            </View>
          </View>,

          <Separator />,
          <FilterEntry title="Tags">
            <Text>To be implemented</Text>
          </FilterEntry>,
        ]}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 16 }}
      />
      <BottomSheetView
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <TouchableOpacity
          style={{ marginLeft: "auto", marginRight: 44 }}
          onPress={handleReset}
        >
          <Text
            color="muted"
            style={{
              textDecorationLine: "underline",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
        <Button onPress={handleSave}>Save</Button>
      </BottomSheetView>
    </Sheet>
  );
}

function FilterEntry({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View>
      <Text style={styles.label} weight="semibold" size="xl">
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 12,
  },
  dualLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
  },
});
