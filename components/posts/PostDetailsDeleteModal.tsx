import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function PostDetailsDeleteModal({
  uuid,
  modalOpen,
  setModalOpen,
}: {
  uuid: string;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = trpc.useUtils();

  const { mutate: deletePost } = trpc.post.delete_post.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      Toast.show({
        text1: "Successfully deleted post",
        swipeable: false,
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
    },
  });

  return (
    <View>
      <Modal
        visible={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        animationType="fade"
        transparent
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={() => setModalOpen(false)}
        >
          <Pressable>
            <View
              color="background"
              style={{
                padding: 24,
                alignItems: "center",
                gap: 12,
                width: 340,
              }}
            >
              <Text size="xl" weight="semibold" color="red">
                Delete post?
              </Text>
              <Text>
                Are you sure you want to delete this post? It will be deleted
                permanently and cannot be recovered.
              </Text>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 20,
                  flexDirection: "row",
                  gap: 46,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(false);
                  }}
                >
                  <Text weight="semibold">CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(false);
                    deletePost({ uuid });
                  }}
                >
                  <Text weight="semibold">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
