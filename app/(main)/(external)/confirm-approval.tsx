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
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function AcceptScreen() {
  const themeColor = useThemeColor();
  const { uuid, selected_payment } = useLocalSearchParams();
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  // get selected service
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  useEffect(() => {
    if (selected_payment) {
      const parsedPayment = JSON.parse(
        selected_payment as string
      ) as PaymentMethod;
      setPayment(parsedPayment);
    }
  }, [selected_payment]);

  // function to handle confirm accept
  const { mutate: approveJob, isLoading: acceptLoading } =
    trpc.job.approve_job.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Approved job",
          swipeable: false,
        });
        utils.job.invalidate();
        utils.post.invalidate();
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
    approveJob({
      user_uuid: user?.id!,
      job_post_uuid: uuid as string,
      linked_payment_method_uuid: payment?.uuid ?? null,
    });
  };

  // get transaction estimate
  const { data, isLoading, error } = trpc.job.get_transaction_estimate.useQuery(
    {
      job_post_uuid: uuid as string,
    }
  );

  // render page
  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Confirm approval" />
        <LoadingView />
      </>
    );
  } else if (error) {
    return (
      <>
        <SimpleHeader title="Confirm approval" />

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Encountered an error getting job information</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Confirm approval" />
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
            Once you approve this worker for a job you cannot unapprove this
            person and ALL payments our finals.
          </Text>
        </View>
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            How much you'll pay
          </Text>
          <TrackTransactionEstimate data={data} type="approve" />
        </View>

        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Payment method
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/choose-payment",
                params: {
                  selected_payment: JSON.stringify(payment),
                },
              });
            }}
            style={[styles.linker, { borderColor: themeColor.foreground }]}
          >
            <View>
              {payment ? (
                <View>
                  <Text>Card ending in {payment.card_last4}</Text>
                </View>
              ) : (
                <Text color="muted">None</Text>
              )}
            </View>

            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Button
          style={styles.button}
          onPress={handleAccept}
          disabled={acceptLoading}
        >
          Approve
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
