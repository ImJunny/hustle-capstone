import { SimpleHeader } from "@/components/headers/Headers";
import TrackTransactionEstimate from "@/components/tracking/TrackTransactionEstimate";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import LoadingScreen from "@/components/ui/LoadingScreen";
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

export default function HireServiceScreen() {
  const themeColor = useThemeColor();
  const { uuid, selected_job } = useLocalSearchParams();
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  // get selected service
  const [job, setJob] = useState<Post | null>(null);
  useEffect(() => {
    if (selected_job) {
      const parsedJob = JSON.parse(selected_job as string) as Post;
      setJob(parsedJob);
    }
  }, [selected_job]);

  // function to handle confirm accept
  const { mutate: acceptJob, isLoading: acceptLoading } =
    trpc.job.accept_job.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Accepted job",
          swipeable: false,
        });
        utils.job.invalidate();
        utils.post.get_post_details_footer_info.invalidate();
        router.back();
        router.setParams({
          param_type: "manage",
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
  const handleAccept = () => {
    // FIX -------------------
    acceptJob({
      user_uuid: user?.id!,
      job_post_uuid: uuid as string,
      linked_service_post_uuid: job?.uuid ?? null,
    });
  };

  // get transaction estimate
  const { data, isLoading, error } = trpc.job.get_transaction_estimate.useQuery(
    {
      job_post_uuid: uuid as string,
    }
  );

  if (!data || isLoading || error) {
    return (
      <LoadingScreen
        data={data}
        loads={isLoading}
        errors={[error]}
        header={<SimpleHeader title="Hire service" />}
      />
    );
  }

  return (
    <>
      <SimpleHeader title="Hire service" />
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
            You must link a job in order to hire a service. There is no
            guarentee they will accept your job, but this job will be viewable
            by them.
          </Text>
        </View>
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Link a job
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/choose-job" as any,
                params: {
                  selected_job: JSON.stringify(job),
                },
              });
            }}
            style={[styles.linker, { borderColor: themeColor.foreground }]}
          >
            <View>
              {job ? (
                <View>
                  <Text>{job.title}</Text>
                </View>
              ) : (
                <Text color="muted">None</Text>
              )}
            </View>

            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            You can link a job which can be viewed by the worker. This will let
            them know what job you are looking to hire them for.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Button
          style={styles.button}
          onPress={handleAccept}
          disabled={acceptLoading}
        >
          Request service
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
