import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Keyboard } from "react-native";
import { useEffect, useRef } from "react";
import { BottomSheetFooter, BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Text from "@/components/ui/Text";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "../ui/IconButton";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Comment as CommentType } from "@/server/actions/comment-actions";
import { formatDistanceToNow } from "date-fns";
import CommentsSheetFooter from "./CommentsSheetFooter";
import { Image } from "expo-image";
import LoadingView from "../ui/LoadingView";
import { FlatList } from "react-native-gesture-handler";

export default function CommentsSheet() {
  const { user } = useAuthData();
  const ref = useRef<BottomSheetMethods>(null);
  const setCommentsSheetRef = useCommentsStore(
    (state) => state.setCommentsSheetRef
  );

  useEffect(() => {
    setCommentsSheetRef(ref);
  }, [setCommentsSheetRef]);

  const themeColor = useThemeColor();
  const commentsSheetRef = useCommentsStore((state) => state.commentsSheetRef);

  const uuid = useCommentsStore((state) => state.postUUID);

  const { data, isLoading } = trpc.comment.get_comments.useQuery(
    {
      post_uuid: uuid!,
      user_uuid: user?.id ?? "",
    },
    { enabled: !!uuid }
  );

  if (!uuid || !user) return;

  const handleClose = () => {
    commentsSheetRef?.current?.forceClose();
    Keyboard.dismiss();
    setCommentsSheetRef(null);
  };

  return (
    <Sheet
      keyboardBehavior="extend"
      sheetRef={ref}
      snapPoints={[1, "100%"]}
      handleComponent={() => (
        <View>
          <View
            style={{
              width: 30,
              height: 4,
              borderRadius: 999,
              marginTop: 10,
              marginHorizontal: "auto",
            }}
            color="background-variant"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 4,
              paddingHorizontal: 16,
              paddingBottom: 12,
              justifyContent: "space-between",
              borderColor: themeColor.border,
              borderBottomWidth: 1,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!isLoading && (
                <>
                  <Text size="xl" weight="semibold">
                    Comments
                  </Text>

                  <Text
                    size="xl"
                    weight="semibold"
                    style={{ marginLeft: 10, marginRight: 6 }}
                  >
                    •
                  </Text>
                  <Text size="xl" weight="semibold">
                    {data?.length}
                  </Text>
                </>
              )}
            </View>

            <IconButton name="close-outline" size="2xl" onPress={handleClose} />
          </View>
        </View>
      )}
      backgroundStyle={{
        backgroundColor: themeColor.background,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: themeColor.border,
        borderRadius: 0,
      }}
      footerComponent={({ animatedFooterPosition }) => (
        <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
          <CommentsSheetFooter uuid={uuid} />
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {isLoading ? (
          <LoadingView style={{ flex: 0, paddingTop: 32 }} />
        ) : !data || data.length === 0 ? (
          <Text style={{ textAlign: "center", paddingTop: 32 }}>
            No comments yet
          </Text>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 72 }}
            data={data}
            renderItem={({ item }) => (
              <Comment data={{ ...item } as unknown as CommentType} />
            )}
          />
        )}
      </BottomSheetView>
    </Sheet>
  );
}

function Comment({ data }: { data: CommentType }) {
  const formattedTimeAgo = formatDistanceToNow(data.timestamp, {
    addSuffix: true,
  })
    .replace("about", "")
    .replace("hours", "hrs")
    .replace("hour", "hr")
    .replace("minutes", "mins")
    .replace("minute", "min")
    .replace("seconds", "secs")
    .replace("second", "sec")
    .trim();

  return (
    <View
      style={{
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
        flexDirection: "row",
        gap: 16,
      }}
    >
      <Image
        source={
          data.user_avatar_url
            ? { uri: data.user_avatar_url }
            : require("@/assets/images/default-avatar-icon.jpg")
        }
        style={{ width: 40, height: 40, borderRadius: 999 }}
      />
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text color="muted" size="sm">
            @{data.user_username}
          </Text>
          <Text color="muted" size="sm">
            • {formattedTimeAgo}
          </Text>
        </View>

        <Text>{data.comment}</Text>
      </View>
    </View>
  );
}
