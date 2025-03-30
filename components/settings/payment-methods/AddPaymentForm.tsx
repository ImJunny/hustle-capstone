import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useStripe } from "@stripe/stripe-react-native";

// Prop types for payment method form
type PaymentMethodFormProps = {
  data?: any; // Define your data type if needed (e.g., payment method data)
};

// Payment method form
export default function AddPaymentForm({ data }: PaymentMethodFormProps) {
  return (
    <View style={{ padding: 20 }}>
      <Text weight="semibold" size="lg" color="muted">
        Payment form is in progress... Please wait.
      </Text>
    </View>
  );
} // import Text from "@/components/ui/Text";
// import View from "@/components/ui/View";
// import Button from "@/components/ui/Button";
// import { useStripe, CardField } from "@stripe/stripe-react-native";
// import { useState } from "react";
// import { trpc } from "@/server/lib/trpc-client";
// import { ActivityIndicator } from "react-native";

// type PaymentMethodFormProps = {
//   user_uuid: string;
//   onSuccess?: () => void;
// };

// export default function AddPaymentForm({
//   user_uuid,
//   onSuccess,
// }: PaymentMethodFormProps) {
//   const { createPaymentMethod } = useStripe();
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { mutateAsync } =
//     trpc.payment_methods.create_payment_method.useMutation();

//   const handleAddPayment = async () => {
//     setLoading(true);
//     setMessage(null);

//     try {
//       const { paymentMethod, error } = await createPaymentMethod({
//         paymentMethodType: "Card",
//         paymentMethodData: {
//           billingDetails: {
//             name: "Test User",
//           },
//         },
//       });

//       if (error || !paymentMethod) {
//         throw new Error(error?.message || "Failed to create payment method");
//       }

//       await mutateAsync({
//         user_uuid,
//         payment_method_id: paymentMethod.id,
//         customer_id: `cus_test_${user_uuid}`,
//         card_last4: paymentMethod.Card?.last4 || "4242",
//         is_default: false,
//       });

//       setMessage("Payment method added successfully!");
//       onSuccess?.();
//     } catch (error) {
//       console.error("Payment error:", error);
//       setMessage(
//         error instanceof Error ? error.message : "Failed to add payment method"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ padding: 20, gap: 16 }}>
//       <Text weight="semibold" size="lg">
//         Add Payment Method
//       </Text>

//       <CardField
//         postalCodeEnabled={false}
//         placeholders={{
//           number: "4242 4242 4242 4242",
//         }}
//         style={{
//           width: "100%",
//           height: 50,
//           marginVertical: 10,
//         }}
//       />

//       <View style={{ position: "relative" }}>
//         <Button onPress={handleAddPayment} disabled={loading} isFullWidth>
//           Add Payment Method
//         </Button>
//         {loading && (
//           <ActivityIndicator
//             style={{ position: "absolute", right: 16, top: 12 }}
//             color="#FFFFFF"
//           />
//         )}
//       </View>

//       {message && (
//         <Text
//           color={message.includes("successfully") ? "green" : "red"}
//           style={{ marginTop: 8 }}
//         >
//           {message}
//         </Text>
//       )}
//     </View>
//   );
// }

/*
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: 8,
    fontSize: 16,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
  },
});
 */
