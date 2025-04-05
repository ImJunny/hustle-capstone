import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import {
  useStripe,
  CardField,
  StripeProvider,
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";
import Input from "@/components/ui/Input";
import { z } from "zod";
import { CreatePaymentMethodSchema } from "@/app/(main)/(external)/add-payment";
import { Controller, UseFormReturn } from "react-hook-form";
import { router } from "expo-router";

type PaymentMethodFormProps = {
  formMethods: UseFormReturn<z.infer<typeof CreatePaymentMethodSchema>>;
};

export default function AddPaymentForm({
  formMethods,
}: PaymentMethodFormProps) {
  const { user } = useAuthData();
  const { createPaymentMethod } = useStripe();
  const [isCardValid, setIsCardValid] = useState(false);
  const utils = trpc.useUtils();
  const themeColor = useThemeColor();

  const { mutate: createMethod, isLoading } =
    trpc.payment.create_payment_method.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Payment method added successfully",
          type: "success",
        });
        utils.payment_methods.invalidate();
        router.back();
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
        });
      },
    });

  const handleAddPayment = async () => {
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: {
          name: formMethods.getValues("cardholder_name"),
          email: user?.email!,
        },
      },
    });

    if (paymentMethod) {
      console.log(paymentMethod);
      createMethod({
        user_uuid: user!.id,
        cardholder_name: formMethods.getValues("cardholder_name"),
        stripe_payment_method_id: paymentMethod.id,
        card_last4: paymentMethod.Card?.last4!,
        card_brand: paymentMethod.Card.brand!,
      });
    }
    if (error) {
      Toast.show({
        text1: "Payment method error",
        text2: error instanceof Error ? error.message : "Invalid card details",
        type: "error",
      });
    }
  };

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      // merchantIdentifier="merchant.com.your-app"
    >
      <View style={{ gap: 20 }}>
        <View style={{ gap: 4 }}>
          <Text size="lg" weight="semibold">
            Cardholder name
          </Text>
          <Controller
            control={formMethods.control}
            name="cardholder_name"
            render={({ field, fieldState }) => (
              <>
                <Input
                  type="outline"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Name on card"
                />
                {fieldState.error && (
                  <Text color="red">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text size="lg" weight="semibold">
            Card information
          </Text>
          <Controller
            control={formMethods.control}
            name="card_is_valid"
            render={({ field, fieldState }) => (
              <>
                <CardField
                  postalCodeEnabled={false}
                  onCardChange={(cardDetails) => {
                    const isValid = cardDetails.complete;
                    setIsCardValid(isValid);
                    field.onChange(isValid);
                  }}
                  cardStyle={{
                    backgroundColor: themeColor.background,
                    textColor: themeColor.foreground,
                    borderWidth: 1,
                    borderColor: fieldState.error
                      ? "red"
                      : themeColor.foreground,
                    borderRadius: 8,
                  }}
                  style={{
                    height: 50,
                    width: "100%",
                  }}
                />
                {fieldState.error && (
                  <Text color="red">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </View>
        <Button
          onPress={formMethods.handleSubmit(handleAddPayment)}
          disabled={isLoading || !isCardValid}
        >
          {isLoading ? "Saving..." : "Add payment method"}
        </Button>
      </View>
    </StripeProvider>
  );
}
