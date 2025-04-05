import Button from "@/components/ui/Button";
import { useStripe } from "@stripe/stripe-react-native";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";

export function ApproveSubmitButton({
  initiatedJobUuid,
  amount,
}: {
  initiatedJobUuid: string;
  amount: number;
}) {
  const { user } = useAuthData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { data } = trpc.payment.process_payment.useQuery({
    user_uuid: user!.id,
    amount,
  });

  // Initialize payment sheet
  const handleInitPaymentSheet = async (data: any) => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Hustle",
      customerId: data?.customer,
      customerEphemeralKeySecret: data?.ephemeralKey,
      paymentIntentClientSecret: data?.paymentIntent!,
      allowsDelayedPaymentMethods: true,
      returnURL: Linking.createURL("stripe-redirect"),
      applePay: {
        merchantCountryCode: "US",
      },
    });
    if (error) Toast.show({ text1: "Payment setup failed", type: "error" });
  };
  if (data) handleInitPaymentSheet(data);

  // Present payment sheet
  const handlePresentPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (!error)
      Toast.show({
        text1: "Processed payment",
        type: "success",
      });
  };

  return (
    <View>
      <Button style={styles.button} onPress={handlePresentPaymentSheet}>
        Pay and approve
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    alignSelf: "flex-end",
  },
});
