import { z } from "zod";
import Button from "../ui/Button";
import { Buffer } from "buffer";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { CreateAddressSchema, CreatePostSchema } from "@/zod/zod-schemas";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCreatePostContext } from "@/contexts/CreatePostContext";

type AddressSubmitButtonProps = {
  uuid?: string;
  isEditing?: boolean;
  setSuggestions: Dispatch<SetStateAction<any>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  formMethods: UseFormReturn<z.infer<typeof CreateAddressSchema>>;
};

export default function AddressSubmitButton({
  uuid,
  isEditing,
  setSuggestions,
  setModalOpen,
  formMethods,
}: AddressSubmitButtonProps) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
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
    const { address_line_1, address_line_2, city, state, zip } =
      formMethods.getValues();
    const encoded_address = `${address_line_1},${
      address_line_2 ? address_line_2 : ""
    },${city},${state},${zip}`.replaceAll(" ", "+");
    findAddress({ encoded_address });
  };

  return (
    <Button
      style={{ marginLeft: "auto", height: 40 }}
      onPress={formMethods.handleSubmit(handleSave)}
    >
      {isEditing ? "Save changes" : "Create address"}
    </Button>
  );
}
