import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { BackHeader, SimpleHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import Switch from "@/components/ui/Switch";
import ScrollView from "@/components/ui/ScrollView";
import Separator from "@/components/ui/Separator";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Toast from "react-native-toast-message";

const notificationTypes = {
  job_accepted: { title: "Accepted", description: "Worker accepts your job" },
  job_approved: {
    title: "Approved",
    description: "Hirer approves you for a job",
  },
  job_in_progress: { title: "In Progress", description: "Worker starts job" },
  job_complete: { title: "Complete", description: "Worker completes job" },
  job_paid: { title: "Paid", description: "Hirer pays for job" },
  job_cancelled: { title: "Canceled", description: "User cancels job" },
};

export default function NotificationsSettingsScreen() {
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  const { data, isLoading, error } =
    trpc.notification.get_disabled_notifications.useQuery({
      user_uuid: user?.id!,
    });

  const { mutate: toggle } = trpc.notification.toggle_notification.useMutation({
    onSuccess: () => {
      utils.notification.get_disabled_notifications.invalidate();
    },
    onError: (error) => {
      Toast.show({ text1: error.message, type: "error" });
    },
  });

  const [disabledToggles, setDisabledToggles] = useState<
    (string | null)[] | undefined
  >(data);

  useEffect(() => {
    setDisabledToggles(data);
  }, [data]);

  const handleToggle = (state: boolean, value: string) => {
    setDisabledToggles((prev) => {
      if (!prev) return prev;
      const newState = state
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      return newState;
    });

    toggle({
      user_uuid: user?.id!,
      notification_type: value,
      disable: !state,
    });
  };

  if (!data || isLoading || error) {
    return (
      <LoadingScreen
        data={data}
        loads={isLoading}
        errors={[error]}
        header={<SimpleHeader title="Notifications settings" />}
      />
    );
  }

  return (
    <>
      <SimpleHeader title="Notifications settings" />
      <ScrollView style={{ padding: 16 }}>
        <Text weight="semibold" size="lg">
          Job Tracking
        </Text>
        <View style={{ gap: 20, marginTop: 20 }}>
          {Object.entries(notificationTypes).map(
            ([key, { title, description }]) => (
              <ToggleRow
                key={key}
                text={title}
                description={description}
                value={key as string}
                disabledToggles={disabledToggles}
                handleToggle={handleToggle}
              />
            )
          )}
        </View>
      </ScrollView>
    </>
  );
}

function ToggleRow({
  text,
  description,
  value,
  disabledToggles,
  handleToggle = () => {},
}: {
  text: string;
  description: string;
  value: string;
  disabledToggles: (string | null)[] | undefined;
  handleToggle: (state: boolean, value: string) => void;
}) {
  const isEnabled = !disabledToggles?.includes(value);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <View>
        <Text weight="semibold">{text}</Text>
        <Text color="muted" size="sm">
          {description}
        </Text>
      </View>

      <Switch
        selected={isEnabled}
        onValueChange={(state: boolean) => handleToggle(state, value)}
      />
    </View>
  );
}
