import {
  AddressesHeader,
  ChooseAddressHeader,
  SimpleHeader,
} from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Address } from "@/server/actions/address-actions";
import LoadingView from "@/components/ui/LoadingView";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { router, useLocalSearchParams } from "expo-router";

// Addresses screen
export default function ChooseAddressScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  if (!user) return;

  const { data: addresses, isLoading } =
    trpc.address.get_user_addresses.useQuery({
      user_uuid: user.id,
    });

  const { selected_address } = useLocalSearchParams();
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(
    selected_address ? JSON.parse(selected_address as string) : undefined
  );

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
      <ChooseAddressHeader />
      <View style={{ flex: 1 }} color="base">
        {addresses.map((address, i) => (
          <AddressEntry
            key={i}
            address={address}
            currentAddress={currentAddress}
            setCurrentAddress={setCurrentAddress}
          />
        ))}
      </View>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <Button
          style={{ alignSelf: "flex-end" }}
          disabled={!currentAddress}
          onPress={() => {
            router.back();
            router.setParams({
              selected_address: JSON.stringify(currentAddress),
            });
          }}
        >
          Select address
        </Button>
      </View>
    </>
  );
}

// Address entry components
type AddressEntryProps = {
  address: Address;
  currentAddress: Address | undefined;
  setCurrentAddress: Dispatch<SetStateAction<Address | undefined>>;
};

function AddressEntry({
  address,
  currentAddress,
  setCurrentAddress,
}: AddressEntryProps) {
  const themeColor = useThemeColor();
  return (
    <TouchableOpacity onPress={() => setCurrentAddress(address)}>
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

        <RadioButton
          value={address.uuid}
          selected={currentAddress?.uuid}
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
