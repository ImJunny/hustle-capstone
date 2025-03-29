import {
  SimpleHeader,
  PaymentMethodsHeader,
} from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import { useCallback, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import PaymentMethodSheet from "@/components/settings/payment-methods/PaymentMethodSheet";
import { StyleSheet } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import LoadingView from "@/components/ui/LoadingView";
import AddressDeleteModal from "@/components/addresses/AddressDeleteModal";
import PaymentDeleteModal from "@/components/payment-methods/PaymentDeleteModal";

// Addresses screen
export default function PaymentMethodsScreen() {
  const { user } = useAuthData();
  if (!user) return;

  const { data: paymentMethods, isLoading } =
    trpc.payment_methods.get_user_payment_methods.useQuery({
      user_uuid: user.id,
    });

  const paymentMethodSheetRef = useRef<BottomSheet>(null);

  const [uuid, setUuid] = useState<string | undefined>();
  const openSheet = useCallback((uuid: string) => {
    paymentMethodSheetRef.current?.expand();
    setUuid(uuid);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Payment Methods" />
        <LoadingView />
      </>
    );
  }

  if (!paymentMethods) {
    return (
      <>
        <PaymentMethodsHeader />
        <View style={styles.centerPage}>
          <Text weight="semibold" size="2xl">
            No payment methods available
          </Text>
          <Text>Add a payment method click the add button at the top</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <PaymentMethodsHeader />
      <View style={{ flex: 1 }} color="base">
        {paymentMethods.map((paymentMethod, i) => (
          <PaymentEntry
            key={i}
            paymentMethod={paymentMethod}
            openSheet={() => openSheet(paymentMethod.uuid)}
          />
        ))}
      </View>
      <PaymentMethodSheet
        sheetRef={paymentMethodSheetRef}
        uuid={uuid!}
        setModalOpen={setModalOpen}
      />
      <AddressDeleteModal
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

  return (
    <View
      color="background"
      style={[styles.entry, { borderColor: themeColor.border }]}
    >
      <View>
        <Text weight="semibold" style={{ marginBottom: 4 }}>
          {paymentMethod.card_brand} - **** {paymentMethod.card_last4}
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
