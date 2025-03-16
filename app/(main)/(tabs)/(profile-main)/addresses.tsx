import { AddressesHeader } from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/ui/IconButton";
import { useCallback, useRef } from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AddressSheet from "@/components/settings/addresses/AddressSheet";
import Button from "@/components/ui/Button";

// Addresses screen
export default function AddressesScreen() {
  const addresses = [
    {
      uuid: "12321",
      street_name: "1234 Maple Street",
      city: "Springfield",
      state: "WA",
      zip: "52661",
    },
  ];

  const addressSheetRef = useRef<BottomSheet>(null);
  const openSheet = useCallback(() => {
    addressSheetRef.current?.expand();
  }, []);

  return (
    <>
      <AddressesHeader />
      {addresses.length === 0 || !addresses ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text weight="semibold" size="2xl">
            No addresses added yet
          </Text>
          <Text>Add an address by clicking on the add button at the top</Text>
        </View>
      ) : (
        <>
          <View style={{ flex: 1 }} color="base">
            {addresses.map((address, i) => (
              <AddressEntry key={i} address={address} openSheet={openSheet} />
            ))}
          </View>
          <AddressSheet sheetRef={addressSheetRef} uuid={"12312"} />
        </>
      )}
    </>
  );
}

// Address entry components
type AddressEntryProps = {
  address: {
    uuid: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
  };
  openSheet: () => void;
};

function AddressEntry({ address, openSheet }: AddressEntryProps) {
  const themeColor = useThemeColor();

  return (
    <View
      color="background"
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          borderColor: themeColor.border,
          justifyContent: "space-between",
          borderBottomWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 44,
        },
      ]}
    >
      <View>
        <Text size="lg">{address.street_name}</Text>
        <Text size="lg">
          {address.city}, {address.state}, {address.zip}
        </Text>
      </View>

      <IconButton name="ellipsis-vertical" onPress={openSheet} />
    </View>
  );
}
