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
import Icon from "../ui/Icon";
import { trpc } from "@/server/lib/trpc-client";
import { ShareUser } from "@/server/actions/user-actions";
import AvatarImage from "../ui/AvatarImage";
import SharePostSheetFooter from "./SharePostSheetFooter";

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

  const { data, isLoading } = trpc.user.get_share_users.useQuery(
    {
      user_uuid: user?.id ?? "",
    },
    { enabled: true }
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const sharePostUUID = useSharePostStore((state) => state.postUUID);

  useEffect(() => {
    setSelected(new Set());
  }, [sharePostUUID]);

  const handleSelect = (value: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(value)) newSelected.delete(value);
      else newSelected.add(value);

      return newSelected;
    });
  };

  if (!user) return;

  const handleClose = () => {
    sharePostSheetRef?.current?.forceClose();
    Keyboard.dismiss();
    setSharePostSheetRef(null);
  };

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

            <IconButton name="close-outline" size="2xl" onPress={handleClose} />
          </View>
        </View>
      )}
      footerComponent={({ animatedFooterPosition }) => (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <SharePostSheetFooter
            count={selected.size}
            selected={selected}
            setSelected={setSelected}
          />
        </BottomSheetFooter>
      )}
      sheetRef={ref}
      snapPoints={[1, "65%"]}
      keyboardBehavior="extend"
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        {isLoading ? (
          <LoadingView style={{ flex: 0, paddingTop: 32 }} />
        ) : (
          <>
            {/* <Input placeholder="Search users..." /> */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
                flexWrap: "wrap",
                rowGap: 24,
              }}
            >
              {data?.map((user) => (
                <User
                  key={user.uuid}
                  data={user}
                  value={user.uuid}
                  selected={selected}
                  handleSelect={handleSelect}
                />
              ))}
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
  data,
}: {
  value: string;
  selected: Set<string>;
  handleSelect: (value: string) => void;
  data: ShareUser;
}) {
  const themeColor = useThemeColor();
  return (
    <View
      style={{
        gap: 12,
        alignItems: "center",
        width: "33.33%",
      }}
    >
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={() => handleSelect(value)}
      >
        <AvatarImage url={data.avatar_url} size={80} />
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
      <Text size="sm">@{data.username}</Text>
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
