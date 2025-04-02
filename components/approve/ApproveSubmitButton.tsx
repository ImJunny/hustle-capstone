import Button from "@/components/ui/Button";
// SUCCESS:
// initiated_job.progress_type: accepted -> in progress
// go back to post page
// remove job from home page for others

// ERROR:
// show error from Stripe
// components/buttons/ApproveButton.tsx

// import { useThemeColor } from "@/hooks/useThemeColor";
// import { View, StyleSheet, Alert } from "react-native";
// import { PaymentMethod } from "@/server/actions/payment-method-actions";
// import { trpc } from "@/server/lib/trpc-client";
// import { useAuthData } from "@/contexts/AuthContext";
// import Toast from "react-native-toast-message";
// import { useState } from "react";
// import ApproveConfirmationModal from "./ApproveConfirmationModal";

// type ApproveButtonProps = {
//   jobPostUuid: string;
//   payment: PaymentMethod | null;
//   amount: number;
//   isLoading?: boolean;
//   onSuccess?: () => void;
//   jobTitle?: string; // For confirmation message
//   workerName?: string; // For confirmation message
// };

// // Payment error types for better error handling
// type PaymentError = {
//   type: "card_declined" | "insufficient_funds" | "processing_error" | "unknown";
//   message: string;
// };

// export function ApproveButton({
//   jobPostUuid,
//   payment,
//   amount,
//   isLoading = false,
//   onSuccess,
//   jobTitle = "this job",
//   workerName = "the worker",
// }: ApproveButtonProps) {
//   const { user } = useAuthData();
//   const utils = trpc.useUtils();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [lastError, setLastError] = useState<PaymentError | null>(null);

//   const { mutate: processPayment } = trpc.payment.process.useMutation();
//   const { mutate: approveJob, isLoading: acceptLoading } =
//     trpc.job.approve_job.useMutation({
//       onSuccess: () => {
//         utils.job.invalidate();
//         utils.post.invalidate();
//         onSuccess?.();
//       },
//       onError: (error) => {
//         showEnhancedError("approval_error", error.message);
//       },
//     });

//   // Enhanced error messages
//   const showEnhancedError = (errorType: string, defaultMessage: string) => {
//     const errors: Record<string, PaymentError> = {
//       card_declined: {
//         type: "card_declined",
//         message: "Your card was declined. Please use a different payment method.",
//       },
//       insufficient_funds: {
//         type: "insufficient_funds",
//         message: "Insufficient funds. Please use a different payment method.",
//       },
//       processing_error: {
//         type: "processing_error",
//         message: "Payment processing error. Please try again.",
//       },
//       approval_error: {
//         type: "unknown",
//         message: "Job approval failed: " + defaultMessage,
//       },
//       default: {
//         type: "unknown",
//         message: defaultMessage,
//       },
//     };

//     const error = errors[errorType] || errors.default;
//     setLastError(error);

//     Toast.show({
//       text1: error.message,
//       swipeable: true,
//       type: "error",
//       visibilityTime: 5000,
//     });
//   };

//   const processPaymentWithRetry = async (attempt: number = 0): Promise<boolean> => {
//     try {
//       await new Promise<void>((resolve, reject) => {
//         processPayment(
//           {
//             amount,
//             paymentMethodId: payment!.uuid,
//             jobPostUuid,
//           },
//           {
//             onSuccess: () => resolve(),
//             onError: (error) => reject(error),
//           }
//         );
//       });
//       return true;
//     } catch (error) {
//       if (attempt < 2) { // Retry up to 2 times (3 total attempts)
//         return processPaymentWithRetry(attempt + 1);
//       }
//       throw error;
//     }
//   };

//   const handleFinalApproval = async () => {
//     setShowConfirmModal(false);
//     setRetryCount(0);
//     setLastError(null);

//     try {
//       // Process payment with retry logic
//       const paymentSuccess = await processPaymentWithRetry();

//       if (paymentSuccess) {
//         // Only approve job if payment succeeded
//         approveJob({
//           user_uuid: user?.id!,
//           job_post_uuid: jobPostUuid,
//           linked_payment_method_uuid: payment!.uuid,
//         });
//       }
//     } catch (error) {
//       // Parse Stripe error code if available
//       const errorCode = error.data?.code || error.code || "unknown";
//       showEnhancedError(errorCode, error.message);
//     }
//   };

//   const handleApprovePress = () => {
//     if (!payment) {
//       Alert.alert(
//         "Payment Method Required",
//         "Please select a payment method before approving",
//         [
//           {
//             text: "Cancel",
//             style: "cancel"
//           },
//           {
//             text: "Choose Payment",
//             onPress: () => router.push("/choose-payment")
//           }
//         ]
//       );
//       return;
//     }

//     if (lastError?.type === "card_declined" || lastError?.type === "insufficient_funds") {
//       Alert.alert(
//         "Payment Issue",
//         lastError.message,
//         [
//           {
//             text: "Cancel",
//             style: "cancel"
//           },
//           {
//             text: "Change Payment",
//             onPress: () => router.push("/choose-payment")
//           }
//         ]
//       );
//       return;
//     }

//     setShowConfirmModal(true);
//   };

//   return (
//     <>
//       <View style={[styles.footer, { borderColor: useThemeColor().border }]}>
//         <Button
//           style={styles.button}
//           onPress={handleApprovePress}
//           disabled={acceptLoading || isLoading || !payment}
//         >
//           {acceptLoading ? "Processing..." : "Approve & Pay"}
//         </Button>
//       </View>

//       <ApproveConfirmationModal
//         visible={showConfirmModal}
//         title="Confirm Approval"
//         message={`Are you sure you want to approve ${workerName} for ${jobTitle} and pay $${amount.toFixed(2)}? This action cannot be undone.`}
//         confirmText="Confirm & Pay"
//         cancelText="Cancel"
//         onConfirm={handleFinalApproval}
//         onCancel={() => setShowConfirmModal(false)}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//   },
//   button: {
//     alignSelf: "flex-end",
//   },
// });
