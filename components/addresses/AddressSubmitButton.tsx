import { z } from "zod";
import Button from "../ui/Button";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { Dispatch, SetStateAction } from "react";
import { Address } from "@/server/actions/address-actions";

type AddressSubmitButtonProps = {
  data?: Address;
  isEditing?: boolean;
  setSuggestions: Dispatch<SetStateAction<any>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddressSubmitButton({
  data,
  isEditing,
  setSuggestions,
  setModalOpen,
}: AddressSubmitButtonProps) {
  const { getValues, handleSubmit } =
    useFormContext<z.infer<typeof CreateAddressSchema>>();
  const { mutate: findAddress, isLoading } =
    trpc.address.find_suggested_address.useMutation({
      onSuccess: (data) => {
        if (!data) {
          Toast.show({
            text1: "No matching addresses found",
            type: "error",
            swipeable: false,
            visibilityTime: 2000,
          });
        } else {
          setSuggestions(data);
          setModalOpen(true);
        }
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
          swipeable: false,
        });
      },
    });

  const handleSave = async () => {
    const {
      address_title,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip,
    } = getValues();

    if (
      [
        data?.title,
        data?.address_line_1,
        data?.address_line_2,
        data?.city,
        data?.state?.toLowerCase().replaceAll(" ", "_"),
        data?.country?.toLowerCase().replaceAll(" ", "_"),
        data?.zip_code,
      ].every(
        (value, i) =>
          value ==
          [
            address_title,
            address_line_1,
            address_line_2,
            city,
            state,
            country,
            zip,
          ][i]
      )
    ) {
      Toast.show({
        text1: "No changes were made",
        swipeable: false,
      });
      return;
    }

    const encoded_address = `${address_line_1},${
      address_line_2 ? address_line_2 : ""
    },${city},${state},${zip}`.replaceAll(" ", "+");
    findAddress({ encoded_address });
  };

  return (
    <Button
      style={{ marginLeft: "auto", height: 40 }}
      onPress={handleSubmit(handleSave)}
      disabled={isLoading}
    >
      {isEditing ? "Save changes" : "Create address"}
    </Button>
  );
}
