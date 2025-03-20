import { AddressesHeader, SimpleHeader } from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import { useCallback, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import AddressSheet from "@/components/settings/addresses/AddressSheet";
import { StyleSheet } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Address } from "@/server/actions/address-actions";
import LoadingView from "@/components/ui/LoadingView";
import AddressDeleteModal from "@/components/addresses/AddressDeleteModal";

// Addresses screen
export default function AddressesScreen() {
  const { user } = useAuthData();
  if (!user) return;

  const { data: addresses, isLoading } =
    trpc.address.get_user_addresses.useQuery({
      user_uuid: user.id,
    });

  const addressSheetRef = useRef<BottomSheet>(null);

  const [id, setId] = useState<number | undefined>();
  const openSheet = useCallback((id: number) => {
    addressSheetRef.current?.expand();
    setId(id);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Addresses" />
        <LoadingView />
      </>
    );
  }

  if (!addresses) {
    return (
      <>
        <AddressesHeader />
        <View style={styles.centerPage}>
          <Text weight="semibold" size="2xl">
            No addresses added yet
          </Text>
          <Text>Add an address by clicking on the add button at the top</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <AddressesHeader />
      <View style={{ flex: 1 }} color="base">
        {addresses.map((address, i) => (
          <AddressEntry
            key={i}
            address={address}
            openSheet={() => openSheet(address.id)}
          />
        ))}
      </View>
      <AddressSheet
        sheetRef={addressSheetRef}
        id={id!}
        setModalOpen={setModalOpen}
      />
      <AddressDeleteModal
        id={id}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}

// Address entry components
type AddressEntryProps = {
  address: Address;
  openSheet: () => void;
};

function AddressEntry({ address, openSheet }: AddressEntryProps) {
  const themeColor = useThemeColor();

  return (
    <View
      color="background"
      style={[styles.entry, { borderColor: themeColor.border }]}
    >
      <View>
        <Text weight="semibold" style={{ marginBottom: 4 }}>
          {address.title}
        </Text>
        <Text>
          {address.address_line_1}
          {address.address_line_2 && `, ${address.address_line_2}`}
        </Text>
        <Text>
          {address.city}, {address.state}, {address.zip_code}
        </Text>
        <Text>{address.country}</Text>
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
