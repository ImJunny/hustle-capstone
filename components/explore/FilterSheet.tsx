import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import View from "../ui/View";
import Button from "../ui/Button";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import RangeSlider from "../ui/RangeSlider";
import Separator from "../ui/Separator";
import { trpc } from "@/server/lib/trpc-client";

export default function FilterSheet({
  sheetRef,
  filters,
  filterSetters,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  filters: { type: "all" | "work" | "hire"; min: number; max: number };
  filterSetters: {
    setMin: (min: number) => void;
    setMax: (max: number) => void;
    setType: (type: "all" | "work" | "hire") => void;
  };
}) {
  const themeColor = useThemeColor();
  const postTypes: Array<"work" | "hire" | "all"> = ["all", "work", "hire"];
  const MIN_CONSTANT = 0;
  const MAX_CONSTANT = 1000;

  const [type, setType] = useState<"all" | "work" | "hire">(
    postTypes[0] as "all" | "work" | "hire"
  );
  const [min, setMin] = useState(MIN_CONSTANT);
  const [max, setMax] = useState(MAX_CONSTANT);

  const utils = trpc.useUtils();
  function handleSave() {
    filterSetters.setMin(min);
    filterSetters.setMax(max);
    filterSetters.setType(type);
    utils.post.get_posts_by_filters.invalidate();
    sheetRef.current?.close();
  }

  function handleReset() {
    setMin(0);
    setMax(1000);
    setType("all");
  }

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Filters"
      snapPoints={[1, "100%"]}
      enableContentPanningGesture={false}
    >
      <BottomSheetScrollView style={{ padding: 16 }}>
        <View style={{ gap: 40 }}>
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
          </FilterEntry>
          <Separator />

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
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
            />
          </View>
          <Separator />
          <FilterEntry title="Distance">
            <Text>To be implemented</Text>
          </FilterEntry>
          <Separator />
          <FilterEntry title="Tags">
            <Text>To be implemented</Text>
          </FilterEntry>

          {/* This view for some reason fixes sheet sizing bug */}
          <View style={{ flex: 1 }} />
        </View>
      </BottomSheetScrollView>
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
