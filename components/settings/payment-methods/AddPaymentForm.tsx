import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import { Dispatch, useState } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import StripeProvider from "@/contexts/StripeContext";

export default function AddPaymentForm({
  setFormVisible,
}: {
  setFormVisible: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuthData();
  const { createPaymentMethod } = useStripe();
  const utils = trpc.useUtils();
  const themeColor = useThemeColor();

  const { mutate: createMethod, isLoading } =
    trpc.payment.create_payment_method.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Payment method added successfully",
          type: "success",
        });
        utils.payment.invalidate();
        setFormVisible(false);
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
        });
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  const handleAddPayment = async () => {
    setLoading(true);
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: {
          name: "",
          email: user?.email!,
        },
      },
    });

    if (paymentMethod) {
      createMethod({
        user_uuid: user!.id,
        stripe_payment_method_id: paymentMethod.id,
      });
    }
    if (error) {
      Toast.show({
        text1: "An error occurred",
        type: "error",
        visibilityTime: 1000,
      });
    }
  };

  const [loading, setLoading] = useState(false);
  return (
    <StripeProvider>
      <View style={{ gap: 20, padding: 16 }}>
        <CardField
          postalCodeEnabled={false}
          cardStyle={{
            backgroundColor: themeColor.background,
            textColor: themeColor.foreground,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: themeColor.foreground,
            placeholderColor: themeColor.muted,
          }}
          style={{
            height: 50,
            width: "100%",
          }}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button style={{ flex: 1 }} onPress={() => setFormVisible(false)}>
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={handleAddPayment}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Add payment method"}
          </Button>
        </View>
      </View>
    </StripeProvider>
  );
}
