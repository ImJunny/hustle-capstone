import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { BackHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserData, updateUserProfile } from "@/server/lib/user";
import Toast from "react-native-toast-message";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// form schema for input validation
const schema = z.object({
  username: z.string().min(1, "Username cannot be empty."),
  firstname: z.string().min(1, "First name cannot be empty."),
  lastname: z.string().min(1, "Last name cannot be empty."),
  bio: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EditProfileScreen() {
  // declare form properties
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // fetch initial user data
  const queryClient = useQueryClient();
  const { user } = useAuthData();
  const { data, isLoading } = useQuery({
    queryKey: ["userDataQuery"],
    queryFn: () => getUserData(user?.id!),
  });

  // update form with fetched data
  const [formReady, setformReady] = useState(false);
  useEffect(() => {
    if (data) {
      setValue("username", data.username ?? "");
      setValue("firstname", data.first_name ?? "");
      setValue("lastname", data.last_name ?? "");
      setValue("bio", data.bio ?? "");
      setformReady(true);
    }
  }, [data, setValue]);

  // mutation to update user data when form submits
  const { mutate, isPending } = useMutation({
    mutationKey: ["userDataMutate"],
    mutationFn: async () => {
      const formData = getValues();
      if (
        data?.username !== formData.username ||
        data?.first_name !== formData.firstname ||
        data?.last_name !== formData.lastname ||
        data?.bio !== formData.bio
      )
        await updateUserProfile(
          user?.id!,
          formData.username,
          formData.firstname,
          formData.lastname,
          formData.bio ?? ""
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDataQuery"] });
      Toast.show({
        text1: "Profile saved",
        swipeable: false,
      });
    },
    onError: () => {
      Toast.show({
        text1: "Error in saving profile",
        type: "error",
        swipeable: false,
      });
    },
  });

  function onSubmit() {
    mutate();
  }

  if (isLoading || !formReady) {
    return <LoadingScreen backHeader />;
  }

  return (
    <>
      <BackHeader />
      <View style={styles.container} color="background">
        <View style={styles.inputEntry}>
          <Text weight="bold" size="lg">
            Username
          </Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <Input
                type="outline"
                placeholder="username"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.username && (
            <Text color="red">{errors.username.message}</Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={[styles.inputEntry, { flex: 1 }]}>
            <Text weight="bold" size="lg">
              First name
            </Text>
            <Controller
              control={control}
              name="firstname"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="outline"
                  placeholder="First"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.firstname && (
              <Text color="red">{errors.firstname.message}</Text>
            )}
          </View>
          <View style={[styles.inputEntry, { flex: 1 }]}>
            <Text weight="bold" size="lg">
              Last name
            </Text>
            <Controller
              control={control}
              name="lastname"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="outline"
                  placeholder="Last"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.lastname && (
              <Text color="red">{errors.lastname.message}</Text>
            )}
          </View>
        </View>

        <View style={styles.inputEntry}>
          <Text weight="bold" size="lg">
            Bio
          </Text>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <Input
                type="outline"
                placeholder="Optional biography"
                value={value}
                onChangeText={onChange}
                multiline={true}
                style={{ height: 100 }}
                textAlignVertical="top"
              />
            )}
          />
        </View>

        <Button
          style={{ alignSelf: "flex-end", minWidth: 120 }}
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
        >
          {isPending ? "Saving" : "Save"}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  inputEntry: {
    gap: 4,
  },
});
