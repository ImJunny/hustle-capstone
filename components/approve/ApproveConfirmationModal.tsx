import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
  titleColor?: string;
};

export default function ApproveConfirmationModal({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "CANCEL",
  onConfirm,
  onCancel,
  confirmColor,
  titleColor,
}: ConfirmationModalProps) {
  return (
    <View>
      <Modal
        visible={visible}
        onRequestClose={onCancel}
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
          onPress={onCancel}
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
              <Text size="xl" weight="semibold" color={"muted"}>
                {title}
              </Text>
              <Text style={{ textAlign: "center" }}>{message}</Text>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 20,
                  flexDirection: "row",
                  gap: 46,
                }}
              >
                <TouchableOpacity onPress={onCancel}>
                  <Text weight="semibold">{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm}>
                  <Text weight="semibold" color={"muted"}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
