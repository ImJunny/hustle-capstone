import { useState } from "react";
import Button from "../ui/Button";
import View from "../ui/View";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";

export default function TrackJobStartButton({
  initiated_uuid,
}: {
  initiated_uuid: string;
}) {
  const themeColor = useThemeColor();
  const utils = trpc.useUtils();
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate: startJob, isLoading } = trpc.job.start_job.useMutation({
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
    startJob({
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
        Start
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
                  Are you sure you want to start the job?
                </Text>

                <Text>
                  Starting the job will mark the job as in progress. You will
                  not be able to cancel the job after it has started. Should
                  there be a dispute, you can reach out to us for help.
                </Text>

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
                    <Text weight="semibold">START</Text>
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
