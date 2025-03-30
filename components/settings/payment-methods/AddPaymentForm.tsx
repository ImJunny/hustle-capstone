import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
// import { useStripe } from "@stripe/stripe-react-native";

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
}

/*
import { useStripe, CardField } from "@stripe/stripe-react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import { Alert, StyleSheet } from "react-native";

type PaymentMethodFormProps = {
  onSuccess?: (paymentMethodId: string) => void;
  onError?: (error: any) => void;
};

export default function AddPaymentForm({
  onSuccess,
  onError,
}: PaymentMethodFormProps) {
  const { createPaymentMethod } = useStripe();

  const handleSubmit = async () => {
    try {
      // 1. Create payment method
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (error) {
        throw error;
      }

      if (!paymentMethod?.id) {
        throw new Error("Payment method creation failed");
      }

      // 2. Call success callback
      onSuccess?.(paymentMethod.id);

      Alert.alert("Success", "Payment method added successfully");
    } catch (error: any) {
      console.error("Payment error:", error);
      onError?.(error);
      Alert.alert("Error", error.message || "Failed to add payment method");
    }
  };

  return (
    <View style={styles.container}>
      <Text weight="bold" size="lg" style={styles.title}>
        Add Payment Method
      </Text>

      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: "4242 4242 4242 4242",
          expiration: "MM/YY",
          cvc: "CVC",
        }}
        cardStyle={styles.card}
        style={styles.cardField}
        onCardChange={(cardDetails) => {
          console.log("Card details:", cardDetails);
        }}
      />

      <Button>Add Payment Method</Button>
    </View>
  );
}

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
