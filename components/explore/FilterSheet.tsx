import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { ReactNode, RefObject, useRef, useState } from "react";
import View from "../ui/View";
import Button from "../ui/Button";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import RangeSlider from "../ui/RangeSlider";
import Separator from "../ui/Separator";
import Input from "../ui/Input";

export default function FilterSheet({
  sheetRef,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
}) {
  const themeColor = useThemeColor();
  const postTypes = ["All", "Jobs", "Services"];
  const MIN_CONSTANT = 10;
  const MAX_CONSTANT = 500;

  const [type, setType] = useState<(typeof postTypes)[number]>(postTypes[0]);
  const [min, setMin] = useState(MIN_CONSTANT);
  const [max, setMax] = useState(MAX_CONSTANT);
  const [minText, setMinText] = useState(String(min));
  const [maxText, setMaxText] = useState(`$${String(max)}`);

  const maxInputRef = useRef<TextInput>(null);
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
                  {postType}
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
              setMinText={setMinText}
              setMaxText={setMaxText}
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
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <TouchableOpacity style={{ marginLeft: "auto", marginRight: 44 }}>
          <Text
            color="muted"
            style={{
              textDecorationLine: "underline",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
        <Button>Save</Button>
      </View>
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
