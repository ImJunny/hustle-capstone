import { SimpleHeader } from "@/components/headers/Headers";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Post } from "@/server/actions/post-actions";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function AcceptScreen() {
  const themeColor = useThemeColor();
  const { uuid, selected_service } = useLocalSearchParams();
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  // get selected service
  const [service, setService] = useState<Post | null>(null);
  useEffect(() => {
    if (selected_service) {
      const parsedService = JSON.parse(selected_service as string) as Post;
      setService(parsedService);
    }
  }, [selected_service]);

  // function to handle confirm accept
  const { mutate: acceptJob, isLoading: acceptLoading } =
    trpc.job.accept_job.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Accepted job",
          swipeable: false,
        });
        router.back();
        utils.job.invalidate();
        utils.post.invalidate();
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          swipeable: false,
          type: "error",
        });
      },
    });
  const handleAccept = () => {
    acceptJob({
      user_uuid: user?.id!,
      job_post_uuid: uuid as string,
      linked_service_post_uuid: service?.uuid ?? null,
    });
  };

  // get transaction estimate
  const { data, isLoading } = trpc.job.get_transaction_estimate.useQuery({
    job_post_uuid: uuid as string,
  });

  // render page
  if (isLoading || !data || !user) {
    return (
      <>
        <SimpleHeader title="Accept job" />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>Encountered an error getting job information</Text>
          </View>
        )}
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Accept job" />
      <ScrollView style={styles.page} color="background">
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Disclaimer
          </Text>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            Accepting this job does not guarentee you will be approved for it.
            The employer will consider all users who accept this job and proceed
            with who they choose. You cannot unaccept within 24 hours of the due
            date.
          </Text>
        </View>
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            How much you'll receive
          </Text>
          <TrackTransactionEstimate data={data} />
        </View>

        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Link a service (optional)
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/choose-service",
                params: {
                  selected_service: JSON.stringify(service),
                },
              });
            }}
            style={[styles.linker, { borderColor: themeColor.foreground }]}
          >
            <View>
              {service ? (
                <View>
                  <Text>{service.title}</Text>
                </View>
              ) : (
                <Text color="muted">None</Text>
              )}
            </View>

            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            You can link a service which can be viewed by the employer. Their
            review will apply to both your account and service. You cannot
            unlink this service after it has already been accepted.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Button
          style={styles.button}
          onPress={handleAccept}
          disabled={acceptLoading}
        >
          Confirm accept
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  linker: {
    marginTop: 10,
    paddingHorizontal: 20,
    height: 60,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  transaction: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 52,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    alignSelf: "flex-end",
  },
});
