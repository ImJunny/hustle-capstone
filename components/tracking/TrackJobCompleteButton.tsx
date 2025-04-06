import { useState } from "react";
import Button from "../ui/Button";
import View from "../ui/View";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";

export default function TrackJobCompleteButton({
  initiated_uuid,
  progress,
}: {
  initiated_uuid: string;
  progress: "in progress" | "approved" | "complete";
}) {
  const themeColor = useThemeColor();
  const utils = trpc.useUtils();
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate: updateProgress, isLoading } =
    trpc.job.update_job_progress.useMutation({
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
    updateProgress({
      uuid: initiated_uuid,
      progress,
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
        Complete
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
                  width: "90%",
                  borderColor: themeColor.border,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text size="xl" weight="semibold">
                  Are you sure you completed this job?
                </Text>

                <Text>
                  This will mark the job as complete and notify the employer.
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
