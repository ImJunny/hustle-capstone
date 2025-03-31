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

type PaymentMethodFormProps = {
  formMethods: UseFormReturn<z.infer<typeof CreatePaymentMethodSchema>>;
};

export default function AddPaymentForm({
  formMethods,
}: PaymentMethodFormProps) {
  const { user } = useAuthData() as { user: { id: string } | undefined };
  const { createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const { mutate: createMethod } =
    trpc.payment_methods.create_payment_method.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: `Successfully added payment method`,
          swipeable: false,
        });
        router.back();
        utils.payment_methods.invalidate();
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
          swipeable: false,
        });
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  if (!user) {
    return <Text>No user data found</Text>;
  }

  const handleAddPayment = async () => {
    setLoading(true);

    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: {
          name: "Test User", // Replace with actual user data
        },
      },
    });

    if (error || !paymentMethod) {
      Toast.show({
        text1: error.message,
        type: "error",
        swipeable: false,
      });
    }

    if (user?.id && paymentMethod) {
      createMethod({
        user_uuid: user.id,
        cardholder_name: formMethods.getValues("cardholder_name"),
        stripe_payment_method_id: paymentMethod.id,
        stripe_customer_id: "1",
        card_last4: paymentMethod.Card?.last4 ?? "0000",
      });
    }
  };
  const [isCardValid, setIsCardValid] = useState(false);

  const themeColor = useThemeColor();
  return (
    <View style={{ padding: 16, gap: 20 }}>
      <View style={{ gap: 4 }}>
        <Text size="lg" weight="semibold">
          Cardholder name
        </Text>
        <Controller
          control={formMethods.control}
          name="cardholder_name"
          render={({ field: { onChange, value } }) => (
            <Input type="outline" value={value} onChangeText={onChange} />
          )}
        />
        {formMethods.formState.errors.cardholder_name && (
          <Text color="red" style={{ marginTop: 4 }}>
            {formMethods.formState.errors.cardholder_name.message}
          </Text>
        )}
      </View>

      <View style={{ gap: 4 }}>
        <Text size="lg" weight="semibold">
          Card information
        </Text>
        <Controller
          control={formMethods.control}
          name="card_is_valid"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <>
              <CardField
                onCardChange={(cardDetails) => {
                  const isValid = cardDetails.complete;
                  setIsCardValid(isValid);
                  onChange(isValid);

                  // Trigger error in real-time
                  if (!isValid) {
                    formMethods.setError("card_is_valid", {
                      type: "manual",
                      message: "Please enter a valid card",
                    });
                  } else {
                    formMethods.clearErrors("card_is_valid");
                  }
                }}
                postalCodeEnabled={false}
                placeholders={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  borderRadius: 6,
                  textColor: themeColor.foreground,
                  placeholderColor: themeColor.muted,
                  backgroundColor: themeColor.background,
                  borderWidth: 1,
                  borderColor: themeColor.foreground,
                }}
                style={{ height: 40 }}
              />
              {error && (
                <Text color="red" style={{ marginTop: 4 }}>
                  {error.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      <Button
        onPress={formMethods.handleSubmit((data) => {
          if (!isCardValid) {
            formMethods.setError("card_is_valid", {
              type: "manual",
              message: "Please enter a valid card.",
            });
            return;
          }
          handleAddPayment();
        })}
        disabled={loading}
      >
        {loading ? "Processing..." : "Add payment method"}
      </Button>
    </View>
  );
}
