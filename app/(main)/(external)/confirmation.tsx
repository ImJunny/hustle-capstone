import { useState } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";

const Confirmation = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const job_uuid = searchParams.job_uuid as string;
  const { user } = useAuthData();

  const [loading, setLoading] = useState(false);

  const { mutate: applyForJob, isLoading: applyLoading } =
    trpc.job.apply_for_job.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Successfully applied for the job",
          swipeable: false,
        });
        router.push("/");
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
          swipeable: false,
        });
      },
      onSettled: () => setLoading(false),
    });

  const handleConfirm = async () => {
    if (!user) {
      Toast.show({
        text1: "You must be logged in to apply",
        type: "error",
        swipeable: false,
      });
      return;
    }

    setLoading(true);
    applyForJob({
      user_uuid: user.id,
      job_uuid,
    });
  };

  const handleDecline = () => router.push("/");

  return (
    <View style={styles.confirmationPage}>
      <Text size="2xl" weight="semibold">
        Are you sure you want to apply for this job?
      </Text>
      <Text size="md" style={{ marginVertical: 8 }}>
        Please confirm your decision below:
      </Text>
      <View style={styles.buttonGroup}>
        <Button onPress={handleConfirm} disabled={loading || applyLoading}>
          {loading || applyLoading ? "Submitting..." : "Yes, I am sure"}
        </Button>
        <Button onPress={handleDecline} type="outline">
          No, take me back
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationPage: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
});

export default Confirmation;
