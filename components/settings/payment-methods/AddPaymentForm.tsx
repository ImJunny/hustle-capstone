import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import { useState } from "react";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
type PaymentMethodFormProps = {
  data?: PaymentMethod;
};

export default function AddPaymentForm({ data }: PaymentMethodFormProps) {
  const { createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddPayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Correct way to create payment method in v0.23.0+
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name: "Test User", // Replace with actual user data
          },
        },
      });

      if (error || !paymentMethod) {
        throw error || new Error("Payment failed");
      }

      setMessage(
        `Success! Card ending in ${paymentMethod.Card?.last4 || "4242"}`
      );
      console.log("Payment method created:", paymentMethod.id);
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Payment failed"}`
      );
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 16 }}>
      <Text weight="semibold" size="lg">
        Insert Details Here
      </Text>

      {/* Stripe's secure card input */}
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: "4242 4242 4242 4242",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 10,
        }}
      />

      <Button onPress={handleAddPayment} disabled={loading}>
        {loading ? "Processing..." : "Add Payment Method"}
      </Button>

      {message && (
        <Text color={message.startsWith("Success") ? "green" : "red"}>
          {message}
        </Text>
      )}
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
