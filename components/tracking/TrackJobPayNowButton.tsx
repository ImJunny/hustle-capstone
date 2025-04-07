import { useState } from "react";
import Button from "../ui/Button";
import View from "../ui/View";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import Separator from "../ui/Separator";

export default function TrackJobPayNowButton({
  initiated_uuid,
  rate,
}: {
  initiated_uuid: string;
  rate: number;
}) {
  const themeColor = useThemeColor();
  const utils = trpc.useUtils();
  const [modalOpen, setModalOpen] = useState(false);

  const formattedRate = `$${rate.toFixed(2)}`;

  const { mutate: finalizeJob, isLoading } = trpc.job.finalize_job.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      utils.job.invalidate();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
    },
  });

  const handleClick = () => {
    setModalOpen(false);
    finalizeJob({
      initiated_uuid,
    });
  };

  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        onPress={handleOpen}
        disabled={isLoading}
        style={{ minWidth: 100 }}
      >
        Pay now
      </Button>

      <View>
        <Modal
          visible={modalOpen}
          onRequestClose={handleClose}
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
            onPress={handleClose}
          >
            <Pressable>
              <View
                color="background"
                style={{
                  padding: 24,
                  gap: 12,
                  maxWidth: "90%",
                  borderColor: themeColor.border,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text size="xl" weight="semibold">
                  Are you sure you want to pay now?
                </Text>

                <Text>
                  This payment has already been initiated. You are about to
                  fully process the payment for the worker which they will
                  receive immediately.
                </Text>
                <View style={{ marginTop: 20 }}>
                  <Separator />
                  <View
                    style={{
                      paddingVertical: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text color="muted">Payment (pending)</Text>
                    <Text color="muted">{formattedRate}</Text>
                  </View>
                  <Separator />
                </View>
                <View
                  style={{
                    alignSelf: "flex-end",
                    marginTop: 20,
                    flexDirection: "row",
                    gap: 46,
                  }}
                >
                  <TouchableOpacity onPress={handleClose}>
                    <Text weight="semibold">CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClick}>
                    <Text weight="semibold">CONFIRM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}
