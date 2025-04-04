import Button from "@/components/ui/Button";
import { useStripe } from "@stripe/stripe-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View, StyleSheet, Alert } from "react-native";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import ApproveConfirmationModal from "./ApproveConfirmationModal";
import { router } from "expo-router";

export function ApproveButton({
  jobPostUuid,
  payment,
  amount,
  isLoading = false,
  jobTitle = "this job",
  workerName = "the worker",
}: {
  jobPostUuid: string;
  payment: PaymentMethod | null;
  amount: number;
  isLoading?: boolean;
  jobTitle?: string;
  workerName?: string;
}) {
  const { confirmPayment } = useStripe();
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      setProcessing(false);
    };
  }, []);

  const { mutate: recordPayment } =
    trpc.confirm_payment.recordPayment.useMutation();
  const { mutate: createPaymentIntent } =
    trpc.confirm_payment.createPaymentIntent.useMutation();
  const { mutate: approveJob } = trpc.job.approve_job.useMutation({
    onSuccess: () => {
      utils.job.invalidate();
      utils.post.invalidate();
      router.replace({
        pathname: "/(main)/(external)/track/hiring/[uuid]",
        params: {
          uuid: jobPostUuid,
          refresh: Date.now(),
          approved_job: jobPostUuid,
        },
      });
    },
  });

  const handlePayment = async () => {
    if (!payment?.stripe_payment_method_id || !user?.id) {
      Alert.alert("Error", "Payment method or user missing");
      return;
    }

    setProcessing(true);
    setShowConfirmModal(false);

    try {
      // 1. Create a TEST Payment Intent (client-side for simplicity)
      const { clientSecret } = await new Promise<{ clientSecret: string }>(
        (resolve, reject) => {
          createPaymentIntent(
            {
              amount: Math.round(amount * 100), // Ensure integer cents
              currency: "usd",
              paymentMethodId: payment.stripe_payment_method_id,
              customerId: payment.stripe_customer_id,
              jobPostUuid,
            },
            {
              onSuccess: (data) => {
                if (data.clientSecret) {
                  resolve({ clientSecret: data.clientSecret });
                } else {
                  reject(new Error("Client secret is null"));
                }
              },
              onError: (error) => reject(new Error(error.message)),
            }
          );
        }
      );

      // 2. Confirm the Payment Intent
      const { error, paymentIntent: confirmedIntent } = await confirmPayment(
        clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: payment.cardholder_name || "Test User",
              email: user.email || "customer@example.com",
              address: {
                country: "US",
                postalCode: "12345",
              },
            },
          },
        }
      );

      if (error) throw error;
      if (
        !confirmedIntent ||
        confirmedIntent.status !==
          ("succeeded" as typeof confirmedIntent.status)
      ) {
        throw new Error(
          confirmedIntent?.status
            ? `Payment status: ${confirmedIntent.status}`
            : "Payment failed"
        );
      }

      // 3. Record payment in your database
      await new Promise<void>((resolve, reject) => {
        recordPayment(
          {
            paymentIntentId: confirmedIntent.id,
            amount,
            jobPostUuid,
            paymentMethodId: payment.uuid,
          },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(new Error(error.message)),
          }
        );
      });

      // 4. Approve the job
      approveJob({
        user_uuid: user.id,
        job_post_uuid: jobPostUuid,
        linked_payment_method_uuid: payment.uuid,
      });

      Toast.show({
        text1: "Test payment successful and worker approved!",
        type: "success",
      });
    } catch (error) {
      const defaultMessage = "Payment failed. Please try again.";
      let userMessage = defaultMessage;

      if (error instanceof Error) {
        console.error("Payment error:", error);

        // User-friendly messages for specific errors
        if (error.message.includes("card_declined")) {
          userMessage =
            "Your card was declined. Please try another payment method.";
        } else if (/insufficient_funds|limit_exceeded/i.test(error.message)) {
          userMessage = "Insufficient funds or limit exceeded.";
        } else if (/network|timeout/i.test(error.message)) {
          userMessage = "Network error. Please check your connection.";
        }
      }

      Toast.show({
        type: "error",
        text1: userMessage,
        text2: "Payment Error",
        visibilityTime: 5000,
      });
    } finally {
      if (!processing) return; // Component might have unmounted
      setProcessing(false);
    }
  };

  const handleApprovePress = () => {
    if (!payment) {
      Alert.alert(
        "Payment Method Required",
        "Please select a payment method before approving",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Choose Payment",
            onPress: () => router.push("/choose-payment"),
          },
        ]
      );
      return;
    }
    setShowConfirmModal(true);
  };

  return (
    <>
      <View>
        <Button
          style={styles.button}
          onPress={handleApprovePress}
          disabled={processing || isLoading || !payment}
        >
          {processing ? "Processing..." : "Approve & Pay"}
        </Button>
      </View>

      <ApproveConfirmationModal
        visible={showConfirmModal}
        title="Confirm Approval"
        message={`You're about to approve ${workerName} for ${jobTitle} and pay $${amount.toFixed(
          2
        )}. This action cannot be undone.`}
        confirmText="Confirm & Pay"
        cancelText="Cancel"
        onConfirm={handlePayment}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
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
