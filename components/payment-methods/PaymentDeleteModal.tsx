import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PaymentDeleteModal({
  uuid,
  modalOpen,
  setModalOpen,
}: {
  uuid: string | undefined;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = trpc.useUtils();

  // Mutation to delete payment method
  const { mutate: deletePaymentMethod } =
    trpc.payment_methods.delete_payment_method.useMutation({
      onSuccess: () => {
        utils.payment_methods.invalidate();
        Toast.show({
          text1: "Successfully deleted payment method",
          swipeable: false,
        });
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          swipeable: false,
          type: "error",
        });
      },
    });
  const themeColor = useThemeColor();
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
                width: "90%",
                borderColor: themeColor.border,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Text size="xl" weight="semibold" color="red">
                Delete payment method?
              </Text>
              <Text>
                Are you sure you want to delete this payment method? This action
                is permanent and cannot be undone.
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
                    if (uuid) deletePaymentMethod({ uuid });
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
