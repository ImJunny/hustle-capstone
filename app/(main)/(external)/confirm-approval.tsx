import { SimpleHeader } from "@/components/headers/Headers";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";
import LoadingView from "@/components/ui/LoadingView";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import StripeProvider from "@/contexts/StripeContext";
import { ApproveButton } from "@/components/approve/ApproveSubmitButton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { PaymentElement } from "@stripe/react-stripe-js";
import { PaymentMethod } from "@/server/actions/payment-actions";

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

  const { data, isLoading, error } = trpc.job.get_transaction_estimate.useQuery(
    {
      job_post_uuid: uuid as string,
    }
  );

  if (error || !data || isLoading) {
    return (
      <LoadingScreen
        data={data}
        loads={[isLoading]}
        errors={[error]}
        header={<SimpleHeader title="Confirm approval" />}
      />
    );
  }

  return (
    <StripeProvider>
      <SimpleHeader title="Confirm approval" />
      <ScrollView style={styles.page} color="background">
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Pay now
          </Text>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            To ensure the worker gets paid after a successful job, you must
            process the transaction now. We'll hold your funds until you confirm
            the job is complete.
          </Text>
        </View>
        <View
          color="background"
          style={{
            padding: 26,
            paddingTop: 0,
          }}
        >
          <Text weight="semibold" size="lg">
            Disclaimer
          </Text>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            Transactions are automatically processed after 5 days of the job's
            due date only if it has been marked as complete. However you can
            choose to pay them earlier. Should there be a dispute, reach out to
            us and we'll help you sort it out.
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
          <TrackTransactionEstimate data={data} type="approve" totalOnly />
        </View>

        {/* <View
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
        </View> */}
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Text weight="semibold" size="lg">
          Step 2 of 2
        </Text>
        <ApproveButton jobPostUuid={uuid as string} amount={data?.rate || 0} />
      </View>
    </StripeProvider>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    alignSelf: "flex-end",
  },
});
