import { SimpleHeader } from "@/components/headers/Headers";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { cancellation_reasons } from "@/constants/Data";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const CancellationFormSchema = z
  .object({
    cancellation_reason: z
      .string()
      .trim()
      .min(1, "Please provide a reason")
      .refine((reason) => reason !== "Select", {
        message: "Please select a reason",
      }),
    details: z.string().trim().optional(),
  })
  .refine(
    (data) => data.cancellation_reason !== "other" || !!data.details?.trim(),
    {
      message: "Please provide more details",
      path: ["details"],
    }
  );

export default function CancelJobScreen() {
  const themeColor = useThemeColor();
  const { initiated_uuid } = useLocalSearchParams();
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  const { control, watch, handleSubmit } = useForm<
    z.infer<typeof CancellationFormSchema>
  >({
    resolver: zodResolver(CancellationFormSchema),
    defaultValues: {
      cancellation_reason: "Select",
      details: "",
    },
  });

  const selected = watch("cancellation_reason");

  const { mutate: cancelJob, isLoading } = trpc.job.cancel_job.useMutation({
    onSuccess: () => {
      Toast.show({
        text1: "Job cancelled",
      });
      utils.job.get_track_hiring_details.invalidate();
      utils.job.get_track_working_details.invalidate();
      utils.post.invalidate();
      router.back();
      router.setParams({
        param_type: undefined,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
      });
    },
  });

  const submit = (values: z.infer<typeof CancellationFormSchema>) => {
    cancelJob({
      job_uuid: initiated_uuid as string,
      user_uuid: user?.id as string,
      cancellation_reason: values.cancellation_reason,
      details: values.details,
    });
  };

  return (
    <>
      <SimpleHeader title="Cancel job" />
      <ScrollView style={styles.page} color="background">
        <View color="background">
          <Text weight="semibold" size="lg">
            Cancellation
          </Text>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            You are only able to cancel a job before it has started. Cancelling
            the job will close and draft the post. You are not able to cancel
            the job after it has already been marked as in progress.
            {`\n\n`}
            Cancelling a job will not affect your completion rate. However, we
            encourage you to stay courteous when participating in future jobs.
          </Text>
        </View>
        <View style={{ paddingTop: 26 }}>
          <Text weight="semibold" size="lg">
            Reason
          </Text>
          <Controller
            name={"cancellation_reason"}
            control={control}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <View>
                <Dropdown
                  style={{ marginTop: 4 }}
                  borderColor="background-variant"
                  data={cancellation_reasons}
                  value={value}
                  onChange={onChange}
                />
                {errors.cancellation_reason && (
                  <Text
                    color={errors.cancellation_reason ? "red" : "muted"}
                    style={{ marginTop: 4 }}
                  >
                    {errors.cancellation_reason?.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        {selected === "other" && (
          <View style={{ paddingTop: 26, gap: 4 }}>
            <Text weight="semibold" size="lg">
              Please provide more details
            </Text>
            <Controller
              name={"details"}
              control={control}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => (
                <View>
                  <Input
                    type="outline"
                    borderColor="background-variant"
                    placeholder="Required"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.details && (
                    <Text color="red" style={{ marginTop: 4 }}>
                      {errors.details?.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Button
          style={styles.button}
          onPress={handleSubmit(submit)}
          disabled={isLoading}
        >
          Confirm cancellation
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 26,
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
