import Button from "@/components/ui/Button";
import { useStripe } from "@stripe/stripe-react-native";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

export function ApproveSubmitButton({
  initiatedJobUuid,
  amount,
}: {
  initiatedJobUuid: string;
  amount: number;
}) {
  const themeColor = useThemeColor();
  const utils = trpc.useUtils();
  const { user } = useAuthData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { data } = trpc.payment.get_payment_intent.useQuery({
    user_uuid: user!.id,
    amount,
  });

  const { mutate: approveJob } = trpc.job.approve_job.useMutation({
    onSuccess: () => {
      Toast.show({
        text1: "Payment successful",
        type: "success",
        swipeable: false,
      });
      utils.post.invalidate();
      utils.job.invalidate();
      router.back();
      router.back();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
    },
  });

  // Initialize payment sheet
  const handleInitPaymentSheet = async (data: any) => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Hustle",
      customerId: data?.customer,
      customerEphemeralKeySecret: data?.ephemeralKey,
      paymentIntentClientSecret: data?.paymentIntentSecret!,
      allowsDelayedPaymentMethods: true,
      returnURL: Linking.createURL("stripe-redirect"),
      appearance: {
        colors: {
          background: themeColor.background,
          componentBackground: themeColor["background-variant"],
          componentText: themeColor.foreground,
          componentBorder: themeColor["background-variant"],
          secondaryText: themeColor.muted,
        },
        primaryButton: {
          colors: {
            background: themeColor.foreground,
            text: themeColor.background,
          },
          shapes: {
            borderRadius: 8,
          },
        },
        shapes: {
          borderRadius: 8,
        },
      },
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
    if (error) return;
    Toast.show({
      text1: "Processed payment",
      type: "success",
    });
    approveJob({
      initiated_uuid: initiatedJobUuid,
      progress: "accepted",
      user_uuid: user!.id,
      payment_intent_id: data?.paymentIntentId!,
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
