import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import View from "../ui/View";
import Button from "../ui/Button";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import RangeSlider from "../ui/RangeSlider";
import Separator from "../ui/Separator";
import { trpc } from "@/server/lib/trpc-client";
import GoogleAutoInput from "../ui/GoogleAutoInput";
import { useAuthData } from "@/contexts/AuthContext";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import TagFilterInput from "../ui/TagFilterInput";
import { tagTypes } from "@/drizzle/db-types";
import { router } from "expo-router";

export default function FilterSheet({
  sheetRef,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
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
  const [tags, setTags] = useState<string[]>([]); // Local state for tags

  const utils = trpc.useUtils();

  useEffect(() => {
    if (geocode === null && expoGeocode) {
      setGeocode(expoGeocode);
      router.setParams({
        geocode: JSON.stringify(expoGeocode),
      });
    }
  }, [expoGeocode]);

  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null);

  function handleSave() {
    router.setParams({
      min_rate: min,
      max_rate: max,
      min_distance: minDistance,
      max_distance: maxDistance == 55 ? 100000 : maxDistance,
      location_type: locationType,
      type: postType,
      geocode: geocode ? JSON.stringify(geocode) : undefined,
      tags: tags.length > 0 ? JSON.stringify(tags) : undefined,
    });
    utils.post.get_posts_by_filters.invalidate();
    sheetRef.current?.close();
    Keyboard.dismiss();
  }

  function handleReset() {
    setMin(0);
    setMax(400);
    setPostType("all");
    setLocationType("all");
    setMinDistance(0);
    setMaxDistance(55);
    setGeocode(expoGeocode);
    setTags([]);
    if (googleInputRef.current) {
      googleInputRef.current.clear();
      googleInputRef.current.blur();
    }
  }
  const filterOptions = [
    {
      key: "Type",
      component: (
        <FilterEntry title="Type">
          <View style={{ flexDirection: "row", gap: 12 }}>
            {postTypes.map((type, i) => (
              <Button
                key={i}
                style={styles.typeButton}
                type={postType === type ? "primary" : "outline"}
                onPress={() => setPostType(type)}
                borderColor="foreground"
              >
                {type === "all" ? "Any" : type === "work" ? "Jobs" : "Services"}
              </Button>
            ))}
          </View>
        </FilterEntry>
      ),
    },
    {
      key: "Location type",
      component: (
        <View style={{ gap: 30 }}>
          <FilterEntry title="Location type">
            <View style={{ flexDirection: "row", gap: 12 }}>
              {locationTypes.map((type, i) => (
                <Button
                  key={i}
                  style={styles.typeButton}
                  type={locationType === type ? "primary" : "outline"}
                  onPress={() => setLocationType(type)}
                  borderColor="foreground"
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
              <FilterEntry
                title="Distance"
                text={
                  minDistance === 0 && maxDistance === 55
                    ? "Any"
                    : minDistance === 0 && maxDistance !== 55
                    ? `Up to ${maxDistance} mi`
                    : minDistance !== 0 && maxDistance === 55
                    ? `${minDistance}+ mi`
                    : `${minDistance}mi - ${maxDistance}mi`
                }
              >
                <RangeSlider
                  minConstant={0}
                  maxConstant={55}
                  setMin={setMinDistance}
                  setMax={setMaxDistance}
                  min={minDistance}
                  max={maxDistance}
                  step={5}
                />
              </FilterEntry>
            </>
          )}
        </View>
      ),
    },
    {
      key: "Rate",
      component: (
        <FilterEntry
          title="Minimum rate"
          text={
            min === MIN_CONSTANT && max === MAX_CONSTANT
              ? "Any"
              : min === MIN_CONSTANT && max !== MAX_CONSTANT
              ? `Up to $${max}`
              : min !== MIN_CONSTANT && max === MAX_CONSTANT
              ? `$${min}+`
              : `$${min}mi - $${max}`
          }
        >
          <RangeSlider
            minConstant={MIN_CONSTANT}
            maxConstant={MAX_CONSTANT}
            setMin={setMin}
            setMax={setMax}
            min={min}
            max={max}
            step={5}
          />
        </FilterEntry>
      ),
    },
    {
      key: "Tags",
      component: (
        <FilterEntry title="Tags">
          <TagFilterInput
            data={tagTypes}
            value={tags}
            onChange={setTags}
            borderColor="border"
          />
        </FilterEntry>
      ),
    },
  ];
  return (
    <Sheet
      sheetRef={sheetRef}
      title="Filters"
      snapPoints={[1, "100%"]}
      enableContentPanningGesture={false}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="none"
      footerComponent={({ animatedFooterPosition }) => (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ backgroundColor: themeColor.background }}
          >
            <View
              color="background"
              style={[styles.footer, { borderColor: themeColor.border }]}
            >
              <TouchableOpacity
                style={{ marginLeft: "auto", marginRight: 44 }}
                onPress={handleReset}
              >
                <Text color="muted" style={{ textDecorationLine: "underline" }}>
                  Reset
                </Text>
              </TouchableOpacity>
              <Button onPress={handleSave}>Save</Button>
            </View>
          </KeyboardAvoidingView>
        </BottomSheetFooter>
      )}
    >
      <KeyboardAvoidingView style={{ flex: 1, padding: 16 }}>
        <BottomSheetFlatList
          data={filterOptions}
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={{ flexGrow: 1, gap: 30, paddingBottom: 80 }}
          renderItem={({ item, index }) => (
            <>
              {item.component}
              {index < filterOptions.length - 1 && (
                <Separator style={{ marginTop: 30 }} />
              )}
            </>
          )}
        />
      </KeyboardAvoidingView>
    </Sheet>
  );
}

function FilterEntry({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children: ReactNode;
}) {
  return (
    <View>
      <View style={styles.label}>
        <Text weight="semibold" size="lg">
          {title}
        </Text>
        <Text>{text}</Text>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
