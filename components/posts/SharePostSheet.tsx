import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { BottomSheetFooter, BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Text from "@/components/ui/Text";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "../ui/IconButton";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "../ui/LoadingView";
import { useSharePostStore } from "@/hooks/useSharePostStore";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

export default function SharePostSheet() {
  const { user } = useAuthData();
  const ref = useRef<BottomSheetMethods>(null);
  const setSharePostSheetRef = useSharePostStore(
    (state) => state.setSharePostSheetRef
  );

  useEffect(() => {
    setSharePostSheetRef(ref);
  }, [setSharePostSheetRef]);

  const themeColor = useThemeColor();
  const sharePostSheetRef = useSharePostStore(
    (state) => state.sharePostSheetRef
  );

  const uuid = useSharePostStore((state) => state.postUUID);

  // const { data, isLoading } = trpc.comment.get_comments.useQuery(
  //   {
  //     post_uuid: uuid!,
  //     user_uuid: user?.id ?? "",
  //   },
  //   { enabled: !!uuid }
  // );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (value: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(value)) {
        newSelected.delete(value);
      } else {
        newSelected.add(value);
      }
      return newSelected;
    });
  };

  if (!uuid || !user) return;

  return (
    <Sheet
      backgroundStyle={[
        styles.backgroundStyle,
        {
          backgroundColor: themeColor.background,
          borderColor: themeColor.border,
        },
      ]}
      handleComponent={() => (
        <View>
          <View style={styles.indicator} color="background-variant" />
          <View style={[styles.handle, { borderColor: themeColor.border }]}>
            <Text size="xl" weight="semibold">
              Share
            </Text>

            <IconButton
              name="close-outline"
              size="2xl"
              onPress={() => {
                sharePostSheetRef?.current?.close();
                Keyboard.dismiss();
              }}
            />
          </View>
        </View>
      )}
      footerComponent={({ animatedFooterPosition }) => (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <Footer count={selected.size} />
        </BottomSheetFooter>
      )}
      sheetRef={ref}
      snapPoints={[1, "65%"]}
      keyboardBehavior="extend"
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        {false ? (
          <LoadingView style={{ flex: 0, paddingTop: 32 }} />
        ) : (
          <>
            {/* <Input placeholder="Search users..." /> */}
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <User
                value="abcd"
                selected={selected}
                handleSelect={handleSelect}
              />
              <User
                value="efgh"
                selected={selected}
                handleSelect={handleSelect}
              />
              <User
                value="ijkl"
                selected={selected}
                handleSelect={handleSelect}
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </Sheet>
  );
}

function User({
  value,
  selected,
  handleSelect,
}: {
  value: string;
  selected: Set<string>;
  handleSelect: (value: string) => void;
}) {
  const themeColor = useThemeColor();
  return (
    <View style={{ gap: 12, alignItems: "center", flex: 1 }}>
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={() => handleSelect(value)}
      >
        <View
          style={{ width: 80, height: 80, borderRadius: 999 }}
          color="red"
        />
        {selected.has(value) && (
          <View style={{ position: "absolute" }}>
            <View
              style={[
                styles.circleBorder,
                { borderColor: themeColor.foreground },
              ]}
            />
            <View style={styles.checkWrapper} color="foreground">
              <Icon name="checkmark" color="background" size="lg" />
            </View>
          </View>
        )}
      </TouchableOpacity>
      <Text size="sm">John Smith</Text>
    </View>
  );
}

function Footer({ count }: { count: number }) {
  return (
    <View
      color="background"
      style={{
        padding: 16,
        borderTopWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Text
        weight="semibold"
        size="lg"
        color={count > 0 ? "foreground" : "muted"}
      >
        {count} selected
      </Text>
      <Button style={{ gap: 12 }} disabled={count == 0}>
        Share
        <Icon name="paper-plane-outline" size="xl" color="background" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  circleBorder: {
    width: 80,
    height: 80,
    position: "relative",
    borderRadius: 999,
    borderWidth: 3,
  },
  checkWrapper: {
    borderRadius: 999,
    position: "absolute",
    right: 2,
    top: 2,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundStyle: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  indicator: {
    width: 30,
    height: 4,
    borderRadius: 999,
    marginTop: 10,
    marginHorizontal: "auto",
  },
  handle: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
});
