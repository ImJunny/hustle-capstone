import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";
import { useStripe, CardField } from "@stripe/stripe-react-native";
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
import Dropdown from "@/components/ui/Dropdown";

type PaymentMethodFormProps = {
  formMethods: UseFormReturn<z.infer<typeof CreatePaymentMethodSchema>>;
};

export default function AddPaymentForm({
  formMethods,
}: PaymentMethodFormProps) {
  const { user } = useAuthData();
  const { createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const utils = trpc.useUtils();
  const themeColor = useThemeColor();

  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
  ];

  const { mutate: createMethod } =
    trpc.payment_methods.create_payment_method.useMutation({
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
      onSettled: () => setLoading(false),
    });

  const handleAddPayment = async () => {
    if (!user?.id) {
      Toast.show({
        text1: "User not authenticated",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create payment method with Stripe
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name: formMethods.getValues("cardholder_name"),
            email: user.email || "", // Add if available
            address: {
              country: formMethods.getValues("country"), // Required for some countries
              postalCode: formMethods.getValues("postal_code"),
            },
          },
        },
      });

      if (error || !paymentMethod?.id) {
        throw new Error(error?.message || "Failed to create payment method");
      }

      if (!paymentMethod.Card?.last4) {
        throw new Error("Card details incomplete");
      }

      // 2. Save to our database
      createMethod({
        user_uuid: user.id,
        cardholder_name: formMethods.getValues("cardholder_name"),
        stripe_payment_method_id: paymentMethod.id,
        stripe_customer_id: `cus_${user.id}`, // Should use real customer ID
        card_last4: paymentMethod.Card?.last4 || "••••",
        card_brand: paymentMethod.Card.brand || "unknown",
      });
    } catch (error) {
      Toast.show({
        text1: "Payment Method Error",
        text2: error instanceof Error ? error.message : "Invalid card details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 20 }}>
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
                postalCodeEnabled={true}
                onCardChange={(cardDetails) => {
                  const isValid = cardDetails.complete;
                  setIsCardValid(isValid);
                  field.onChange(isValid);
                  formMethods.clearErrors("card_is_valid");

                  if (cardDetails.postalCode) {
                    formMethods.setValue("postal_code", cardDetails.postalCode);
                  }
                }}
                cardStyle={{
                  backgroundColor: themeColor.background,
                  textColor: themeColor.foreground,
                  borderWidth: 1,
                  borderColor: fieldState.error ? "red" : themeColor.border,
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

      <View>
        <Text weight="semibold" size="lg">
          Country/Region
        </Text>
        <Controller
          control={formMethods.control}
          name="country"
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <Dropdown
                style={{ marginTop: 4 }}
                borderColor={fieldState.error ? "red" : "background-variant"}
                data={countries.map(({ code, name }) => ({
                  value: code,
                  label: name,
                }))}
                value={value}
                onChange={onChange}
              />
              {fieldState.error && (
                <Text color="red" style={{ marginTop: 4 }}>
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      <Button
        onPress={formMethods.handleSubmit(handleAddPayment)}
        disabled={loading || !isCardValid}
      >
        {loading ? "Saving..." : "Add Payment Method"}
      </Button>
    </View>
  );
}
