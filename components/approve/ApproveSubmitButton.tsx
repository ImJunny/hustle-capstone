import Button from "@/components/ui/Button";
import { useStripe } from "@stripe/stripe-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View, StyleSheet, Alert } from "react-native";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useState } from "react";
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

  const { mutate: recordPayment } =
    trpc.confirm_payment.recordPayment.useMutation();
  const { mutate: approveJob } = trpc.job.approve_job.useMutation({
    onSuccess: () => {
      utils.job.invalidate();
      utils.post.invalidate();
      router.replace({
        pathname: "/(main)/(external)/track/hiring/[uuid]", // Your specific route
        params: {
          uuid: jobPostUuid, // Required: add the uuid property
          refresh: Date.now(), // Optional: force refresh
          approved_job: jobPostUuid, // Optional: pass data
        },
      });
    },
  });

  const handlePayment = async () => {
    if (!payment?.stripe_payment_method_id) {
      Alert.alert("Payment Error", "No valid payment method selected");
      return;
    }

    setProcessing(true);
    setShowConfirmModal(false);

    try {
      // 1. Confirm payment directly with Stripe
      const { paymentIntent, error } = await confirmPayment(
        // Payment method ID from your PaymentMethod object
        payment.stripe_payment_method_id,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: payment.cardholder_name || "Hassan",
              email: user?.email || "", // Strongly recommended
              address: {
                country: "US", // Required for some countries
                postalCode: "12345",
              },
            },
            cvc: "424",
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentIntent) {
        throw new Error("Payment failed - no payment intent returned");
      }

      // 2. Record payment in your database
      await new Promise<void>((resolve, reject) => {
        recordPayment(
          {
            paymentIntentId: paymentIntent.id,
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

      // 3. Approve the job
      approveJob({
        user_uuid: user?.id!,
        job_post_uuid: jobPostUuid,
        linked_payment_method_uuid: payment.uuid,
      });

      Toast.show({
        text1: "Payment successful and worker approved!",
        type: "success",
      });
    } catch (error) {
      let errorMessage = "Payment failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (error.message.includes("payment method")) {
          errorMessage =
            "Invalid payment method. Please update your payment details.";
        }
      }

      Toast.show({
        text1: errorMessage,
        text2: "Payment Error",
        type: "error",
        visibilityTime: 5000,
      });
    } finally {
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
      <View style={[styles.footer, { borderColor: useThemeColor().border }]}>
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
