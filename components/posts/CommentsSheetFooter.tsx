import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import Input from "../ui/Input";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import IconButton from "../ui/IconButton";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import { useState } from "react";

export default function CommentsSheetFooter({ uuid }: { uuid: string }) {
  const themeColor = useThemeColor();
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  const [disabled, setDisabled] = useState(false);
  const { mutate: send, isLoading } = trpc.comment.send_comment.useMutation({
    onSuccess: () => {
      utils.comment.invalidate();
      utils.post.get_home_posts.invalidate();
      utils.post.get_post_details_info.invalidate();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
    },
    onSettled: () => {
      setDisabled(false);
    },
  });

  const handleSend = () => {
    if (text.length > 0) {
      setDisabled(true);
      send({
        post_uuid: uuid,
        user_uuid: user?.id!,
        comment: text,
      });
    }
  };

  const [text, setText] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: themeColor.background }}
    >
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Input
          placeholder="Comment..."
          style={{ flexGrow: 1 }}
          value={text}
          onChangeText={(value) => setText(value)}
        />

        <IconButton
          name="paper-plane"
          onPress={handleSend}
          disabled={isLoading || disabled}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
