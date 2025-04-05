import {
  SimpleHeader,
  PaymentMethodsHeader,
} from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import PaymentMethodSheet from "@/components/settings/payment-methods/PaymentMethodSheet";
import { StyleSheet } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import PaymentDeleteModal from "@/components/payment-methods/PaymentDeleteModal";
import { PaymentMethod } from "@/server/actions/payment-actions";
import AddPaymentForm from "@/components/settings/payment-methods/AddPaymentForm";
import ScrollView from "@/components/ui/ScrollView";

export default function PaymentMethodsScreen() {
  const { user } = useAuthData();
  if (!user) return;

  const {
    data: paymentMethods,
    isLoading,
    error,
  } = trpc.payment.get_user_payment_methods.useQuery({
    user_uuid: user.id,
  });

  if (error) {
    return (
      <>
        <SimpleHeader title="Payment Methods" />
        <View style={styles.centerPage}>
          <Text>Error loading payment methods</Text>
        </View>
      </>
    );
  }

  const paymentMethodSheetRef = useRef<BottomSheet>(null);

  const [uuid, setUuid] = useState<string | undefined>();
  const openSheet = useCallback((uuid: string) => {
    paymentMethodSheetRef.current?.expand();
    setUuid(uuid);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Payment methods" />
        <LoadingView />
      </>
    );
  }

  return (
    <>
      <PaymentMethodsHeader setFormVisible={setFormVisible} />
      <View style={{ padding: 16, borderBottomWidth: 1 }}>
        <Text size="sm" color="muted">
          You can quickly manage card payment methods here or at checkout.
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} color="background">
        {paymentMethods.map((paymentMethod, i) => (
          <PaymentEntry
            key={i}
            paymentMethod={paymentMethod as PaymentMethod}
            openSheet={() => openSheet(paymentMethod.id)}
          />
        ))}
        {formVisible && <AddPaymentForm setFormVisible={setFormVisible} />}
      </ScrollView>

      <PaymentMethodSheet
        sheetRef={paymentMethodSheetRef}
        setModalOpen={setModalOpen}
      />
      <PaymentDeleteModal
        uuid={uuid}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}

type PaymentEntryProps = {
  paymentMethod: PaymentMethod;
  openSheet: () => void;
};

function PaymentEntry({ paymentMethod, openSheet }: PaymentEntryProps) {
  const themeColor = useThemeColor();
  const cardBrands: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    discover: "Discover",
    diners: "Diners Club",
    jcb: "JCB",
    unionpay: "UnionPay",
    unknown: "Card",
  };

  return (
    <View
      color="background"
      style={[styles.entry, { borderColor: themeColor.border }]}
    >
      <View>
        <Text weight="semibold" size="lg">
          {cardBrands[paymentMethod.brand]} ending in {paymentMethod.last4}
        </Text>
        <Text>
          Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
        </Text>
      </View>
      <IconButton name="ellipsis-vertical" onPress={openSheet} />
    </View>
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
});
