import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { Keyboard, TouchableOpacity } from "react-native";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { BottomSheetFooter, BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import { router } from "expo-router";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import Input from "../ui/Input";
import { KeyboardAvoidingView } from "react-native";
import Button from "../ui/Button";
import { Platform } from "react-native";
import IconButton from "../ui/IconButton";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Comment as CommentType } from "@/server/actions/comment-actions";
import { formatDistanceToNow } from "date-fns";

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
  if (!uuid || !user) return;
  const { data, isLoading } = trpc.comment.get_comments.useQuery({
    post_uuid: uuid,
    user_uuid: user?.id,
  });

  return (
    <Sheet
      sheetRef={ref}
      snapPoints={[1, "50%", "80%"]}
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
            </View>

            <IconButton
              name="close-outline"
              size="2xl"
              onPress={() => {
                commentsSheetRef?.current?.close();
                Keyboard.dismiss();
              }}
            />
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ backgroundColor: themeColor.background }}
          >
            <View style={{ padding: 16, borderTopWidth: 1 }}>
              <Input placeholder="Comment..." />
            </View>
          </KeyboardAvoidingView>
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView style={{ flex: 1, padding: 0 }}>
        {!data || data.length === 0 ? (
          <Text style={{ textAlign: "center", paddingTop: 16 }}>
            No comments yet
          </Text>
        ) : (
          data?.map((comment) => (
            <Comment data={comment as unknown as CommentType} />
          ))
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
      <ImagePlaceholder width={40} height={40} style={{ borderRadius: 999 }} />
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
