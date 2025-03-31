import {
  SimpleHeader,
  PaymentMethodsHeader,
  ChoosePaymentHeader,
} from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import LoadingView from "@/components/ui/LoadingView";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { router, useLocalSearchParams } from "expo-router";

// Payment Methods screen
export default function ChoosePaymentScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  if (!user) return;

  const { data: paymentMethods, isLoading } =
    trpc.payment_methods.get_user_payment_methods.useQuery({
      user_uuid: user.id,
    });

  const { selected_payment } = useLocalSearchParams();
  const [currentPayment, setCurrentPayment] = useState<
    PaymentMethod | undefined
  >(selected_payment ? JSON.parse(selected_payment as string) : undefined);

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Payment Methods" />
        <LoadingView />
      </>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <>
        <PaymentMethodsHeader />
        <View style={styles.centerPage}>
          <Text weight="semibold" size="2xl">
            No payment methods added yet
          </Text>
          <Text>Add payment method by clicking add button at the top</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <ChoosePaymentHeader />
      <View style={{ flex: 1 }} color="base">
        {paymentMethods.map((paymentMethod, i) => (
          <PaymentEntry
            key={i}
            paymentMethod={paymentMethod}
            currentPaymentMethod={currentPayment}
            setCurrentPaymentMethod={setCurrentPayment}
          />
        ))}
      </View>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <Button
          style={{ alignSelf: "flex-end" }}
          disabled={!currentPayment}
          onPress={() => {
            router.back();
            router.setParams({
              selected_payment: JSON.stringify(currentPayment),
            });
          }}
        >
          Select payment method
        </Button>
      </View>
    </>
  );
}

// Address entry components
type PaymentEntryProps = {
  paymentMethod: PaymentMethod;
  currentPaymentMethod: PaymentMethod | undefined;
  setCurrentPaymentMethod: Dispatch<SetStateAction<PaymentMethod | undefined>>;
};

function PaymentEntry({
  paymentMethod,
  currentPaymentMethod,
  setCurrentPaymentMethod,
}: PaymentEntryProps) {
  const themeColor = useThemeColor();
  return (
    <TouchableOpacity onPress={() => setCurrentPaymentMethod(paymentMethod)}>
      <View
        color="background"
        style={[styles.entry, { borderColor: themeColor.border }]}
      >
        <View>
          <Text weight="semibold">{paymentMethod.cardholder_name}</Text>
          <Text>Card ending in ****{paymentMethod.card_last4}</Text>
        </View>

        <RadioButton
          value={paymentMethod.uuid}
          selected={currentPaymentMethod?.uuid}
          disabled
        />
      </View>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  centerPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  page: { padding: 16 },
  typeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  buttonRow: { marginTop: 10, flexDirection: "row", gap: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
