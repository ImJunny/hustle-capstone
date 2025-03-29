import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import View from "../ui/View";
import Button from "../ui/Button";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import RangeSlider from "../ui/RangeSlider";
import Separator from "../ui/Separator";
import { trpc } from "@/server/lib/trpc-client";
import GoogleAutoInput from "../ui/GoogleAutoInput";
import { useAuthData } from "@/contexts/AuthContext";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";

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
    setLocationType: (locationType: "all" | "remote" | "local") => void;
    setType: (type: "all" | "work" | "hire") => void;
    setGeocode: (lat: number, lng: number) => void;
  };
}) {
  const themeColor = useThemeColor();
  const postTypes: Array<"work" | "hire" | "all"> = ["all", "work", "hire"];
  const locationTypes: Array<"all" | "remote" | "local"> = [
    "all",
    "local",
    "remote",
  ];
  const MIN_CONSTANT = 0;
  const MAX_CONSTANT = 400;
  const { geocode: expoGeocode } = useAuthData();

  // local filters
  const [postType, setPostType] = useState<"all" | "work" | "hire">(
    postTypes[0] as "all" | "work" | "hire"
  );
  const [locationType, setLocationType] = useState<"all" | "remote" | "local">(
    "all"
  );
  const [min, setMin] = useState(MIN_CONSTANT);
  const [max, setMax] = useState(MAX_CONSTANT);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(55);
  const [geocode, setGeocode] = useState<[number, number] | null>(expoGeocode);

  const utils = trpc.useUtils();

  useEffect(() => {
    if (geocode === null && expoGeocode) {
      setGeocode(expoGeocode);
      filterSetters.setGeocode(expoGeocode[0], expoGeocode[1]);
    }
  }, [expoGeocode]);

  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null);

  // save query filters
  function handleSave() {
    filterSetters.setMin(min);
    filterSetters.setMax(max);
    filterSetters.setType(postType);
    filterSetters.setMinDistance(minDistance);
    filterSetters.setMaxDistance(maxDistance == 55 ? 100000 : maxDistance);
    filterSetters.setLocationType(locationType);
    if (geocode) {
      const [lat, lng] = geocode;
      filterSetters.setGeocode(lat, lng);
    } else if (expoGeocode) {
      filterSetters.setGeocode(expoGeocode[0], expoGeocode[1]);
    }
    utils.post.get_posts_by_filters.invalidate();
    sheetRef.current?.close();
  }

  function handleReset() {
    setMin(0);
    setMax(400);
    setPostType("all");
    setLocationType("all");
    setMinDistance(0);
    setMaxDistance(55);
    setGeocode(expoGeocode);
    if (googleInputRef.current) {
      googleInputRef.current.clear();
      googleInputRef.current.blur();
    }
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
        contentContainerStyle={{ gap: 30 }}
        renderItem={({ item }: { item: ReactNode }) => <>{item}</>}
        data={[
          <FilterEntry title="Type">
            <View style={{ flexDirection: "row", gap: 12 }}>
              {postTypes.map((type, i) => (
                <Button
                  key={i}
                  style={styles.typeButton}
                  type={postType === type ? "primary" : "outline"}
                  onPress={() => setPostType(type)}
                >
                  {type === "all"
                    ? "Any"
                    : type === "work"
                    ? "Jobs"
                    : "Services"}
                </Button>
              ))}
            </View>
          </FilterEntry>,
          <Separator />,
          <View style={{ gap: 20 }}>
            <FilterEntry title="Location type">
              <View style={{ flexDirection: "row", gap: 12 }}>
                {locationTypes.map((type, i) => (
                  <Button
                    key={i}
                    style={styles.typeButton}
                    type={locationType === type ? "primary" : "outline"}
                    onPress={() => setLocationType(type)}
                  >
                    {type === "all"
                      ? "Any"
                      : type === "remote"
                      ? "Remote"
                      : "Local"}
                  </Button>
                ))}
              </View>
            </FilterEntry>
            {locationType !== "remote" && (
              <>
                <GoogleAutoInput
                  setGeocode={setGeocode}
                  googleInputRef={googleInputRef}
                />

                <View>
                  <View style={styles.dualLabel}>
                    <Text weight="semibold" size="lg">
                      Distance
                    </Text>
                    <Text>
                      {minDistance === 0 && maxDistance === 55
                        ? "Any"
                        : minDistance === 0 && maxDistance !== 55
                        ? `up to ${maxDistance} mi`
                        : minDistance !== 0 && maxDistance === 55
                        ? `${minDistance} mi +`
                        : `${minDistance} mi - ${maxDistance} mi`}
                    </Text>
                  </View>
                  <RangeSlider
                    minConstant={0}
                    maxConstant={55}
                    setMin={setMinDistance}
                    setMax={setMaxDistance}
                    min={minDistance}
                    max={maxDistance}
                    step={5}
                  />
                </View>
              </>
            )}
          </View>,
          <Separator />,
          <View>
            <View style={styles.dualLabel}>
              <Text weight="semibold" size="lg">
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

          // <Separator />,
          // <FilterEntry title="Tags">
          //   <Text>To be implemented</Text>
          // </FilterEntry>,
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
      <Text style={styles.label} weight="semibold" size="lg">
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
    paddingHorizontal: 20,
    height: 34,
    borderRadius: 999,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
  },
});
