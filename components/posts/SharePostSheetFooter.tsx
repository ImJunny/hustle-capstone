import { useSharePostStore } from "@/hooks/useSharePostStore";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import View from "../ui/View";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Keyboard } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Dispatch, SetStateAction } from "react";

export default function SharePostSheetFooter({
  count,
  selected,
  setSelected,
}: {
  count: number;
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
}) {
  const uuid = useSharePostStore((state) => state.postUUID);
  const sharePostSheetRef = useSharePostStore(
    (state) => state.sharePostSheetRef
  );

  const { user } = useAuthData();

  const { mutate: sharePost, isLoading } =
    trpc.messages.send_post_message.useMutation({
      onSuccess: () => {
        sharePostSheetRef?.current?.close();
        Keyboard.dismiss();
        setSelected(new Set());
        Toast.show({
          text1: "You shared a post",
          swipeable: false,
        });
      },
    });
  if (!uuid || !user) return null;

  const handleShare = () => {
    sharePost({
      post_uuid: uuid,
      receiver_uuids: Array.from(selected),
      sender_uuid: user?.id,
    });
  };
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
      <Button
        style={{ gap: 12 }}
        disabled={count == 0 || isLoading}
        onPress={handleShare}
      >
        Share
        <Icon name="paper-plane-outline" size="xl" color="background" />
      </Button>
    </View>
  );
}
