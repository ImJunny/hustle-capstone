import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { SuggestedAddress } from "@/server/actions/address-actions";
import RadioButton from "../ui/RadioButton";
import { useAuthData } from "@/contexts/AuthContext";
import { useFormContext } from "react-hook-form";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { z } from "zod";

export default function AddressSuggestionsModal({
  suggestions,
  modalOpen,
  setModalOpen,
  isEditing,
  uuid,
}: {
  suggestions: SuggestedAddress[] | undefined;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  isEditing?: boolean;
  uuid?: string | undefined;
}) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();

  const { mutate: updateAddress } = trpc.address.update_address.useMutation({
    onSuccess: () => {
      utils.address.invalidate();
      Toast.show({
        text1: "Successfully updated address",
        swipeable: false,
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
    },
  });

  const { mutate: createAddress } = trpc.address.create_address.useMutation({
    onSuccess: () => {
      utils.address.invalidate();
      Toast.show({
        text1: `Successfully ${isEditing ? "saved" : "created"} address`,
        swipeable: false,
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
    },
  });

  const [choice, setChoice] = useState<number | undefined>(0);
  const [suggestion, setSuggestion] = useState<SuggestedAddress | undefined>();

  useEffect(() => {
    if (suggestions && suggestions.length > 0) setSuggestion(suggestions[0]);
  }, [suggestions]);

  const { getValues } = useFormContext<z.infer<typeof CreateAddressSchema>>();
  return (
    <View>
      <Modal
        visible={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        animationType="fade"
        transparent
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={() => setModalOpen(false)}
        >
          <Pressable>
            <View
              color="background"
              style={{
                padding: 24,
                gap: 12,
                width: 340,
              }}
            >
              <Text size="xl" weight="semibold">
                Suggested addresses
              </Text>
              <View style={{ gap: 24 }}>
                {suggestions?.map((suggestion, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    onPress={() => {
                      setChoice(i);
                      setSuggestion(suggestion);
                    }}
                  >
                    <View>
                      <Text>
                        {suggestion.address_line_1}
                        {suggestion.address_line_2 &&
                          `, ${suggestion.address_line_2}`}
                      </Text>
                      <Text>
                        {suggestion.city}, {suggestion.state}, {suggestion.zip}
                      </Text>
                      <Text>{suggestion.country}</Text>
                    </View>
                    <RadioButton
                      value={String(i)}
                      selected={String(choice)}
                      disabled
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 20,
                  flexDirection: "row",
                  gap: 46,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(false);
                  }}
                >
                  <Text weight="semibold">CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(false);
                    if (isEditing && uuid)
                      updateAddress({
                        uuid,
                        title: getValues("address_title"),
                        address_line_1: suggestion?.address_line_1!,
                        address_line_2: suggestion?.address_line_2,
                        city: suggestion?.city!,
                        state: suggestion?.state!,
                        country: suggestion?.country!,
                        zip_code: suggestion?.zip!,
                        location: [
                          suggestion?.latitude!,
                          suggestion?.longitude!,
                        ],
                      });
                    else
                      createAddress({
                        user_uuid: user?.id!,
                        title: getValues("address_title"),
                        address_line_1: suggestion?.address_line_1!,
                        address_line_2: suggestion?.address_line_2,
                        city: suggestion?.city!,
                        state: suggestion?.state!,
                        country: suggestion?.country!,
                        zip_code: suggestion?.zip!,
                        location: [
                          suggestion?.latitude!,
                          suggestion?.longitude!,
                        ],
                      });
                  }}
                >
                  <Text weight="semibold">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
