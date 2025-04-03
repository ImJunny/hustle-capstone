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
      const testPaymentIntentParams = {
        amount: amount * 100, // Convert to cents
        currency: "usd",
        paymentMethodId: payment.stripe_payment_method_id,
        customerId: payment.stripe_customer_id,
      };

      // In test mode, we'll use a hardcoded test client secret
      // Replace this with a real client secret from your test Payment Intent
      const TEST_CLIENT_SECRET = "pi_example_test_secret_123";

      // 2. Confirm the Payment Intent
      const { error, paymentIntent } = await confirmPayment(
        TEST_CLIENT_SECRET,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: payment.cardholder_name || "Test User",
              email: user.email || "test@example.com",
            },
          },
        }
      );

      if (error) throw new Error(error.message);
      if (!paymentIntent) throw new Error("Payment failed");

      // 3. Record payment in your database
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
      let errorMessage = "Test payment failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.log(error);
        if (error.message.includes("payment method")) {
          errorMessage = "Invalid payment method. Please use a test card.";
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
