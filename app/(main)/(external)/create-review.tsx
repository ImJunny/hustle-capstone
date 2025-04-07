import View from "@/components/ui/View";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "@/components/ui/ScrollView";
import { Controller, useForm, UseFormGetValues } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import StarInput from "@/components/ui/StarInput";
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthData } from "@/contexts/AuthContext";
import { initiated_jobs } from "@/drizzle/schema";

const schema = z.object({
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
  review: z.string().optional(),
});

export default function CreateReviewScreen() {
  const { initiated_uuid } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const [modalOpen, setModalOpen] = useState(false);

  const onPress = handleSubmit(() => {
    setModalOpen(true);
  });

  return (
    <>
      <SimpleHeader title="Leave a review" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.page} color="background">
            <Controller
              control={control}
              name="rating"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{ marginVertical: 32, gap: 10, alignItems: "center" }}
                >
                  <StarInput value={value} onChange={onChange} />
                  {errors.rating && (
                    <Text color="red">{errors.rating.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="review"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text weight="semibold" size="lg">
                    Review
                  </Text>
                  <Input
                    style={{
                      height: 100,
                      textAlignVertical: "top",
                      paddingVertical: 8,
                    }}
                    type="outline"
                    borderColor="border"
                    placeholder="Optional"
                    onChangeText={onChange}
                    value={value?.toString()}
                  />
                </View>
              )}
            />
            <Button onPress={onPress} style={{ marginTop: 16 }}>
              Submit
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        getValues={getValues}
        initiated_uuid={initiated_uuid as string}
      />
    </>
  );
}

function ConfirmModal({
  modalOpen,
  setModalOpen,
  getValues,
  initiated_uuid,
}: {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  getValues: UseFormGetValues<z.infer<typeof schema>>;
  initiated_uuid: string;
}) {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  const onPress = () => {
    setModalOpen(false);
    createReview({
      user_uuid: user?.id as string,
      initiated_uuid: initiated_uuid,
      rating: getValues("rating"),
      review: getValues("review"),
    });
  };

  const utils = trpc.useUtils();
  const { mutate: createReview } = trpc.review.create_review.useMutation({
    onSuccess: () => {
      utils.review.invalidate();
      Toast.show({ text1: "You left a review", swipeable: false });
      router.back();
      setModalOpen(false);
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
    },
  });

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
                alignItems: "center",
                gap: 12,
                width: "90%",
                borderColor: themeColor.border,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Text size="xl" weight="semibold">
                Confirm review
              </Text>
              <Text>This review will be submitted and cannot be changed.</Text>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 20,
                  flexDirection: "row",
                  gap: 46,
                }}
              >
                <TouchableOpacity onPress={onPress}>
                  <Text weight="semibold">CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
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

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  page: { padding: 16, flex: 1 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  footerButton: {
    alignSelf: "flex-end",
  },
});
