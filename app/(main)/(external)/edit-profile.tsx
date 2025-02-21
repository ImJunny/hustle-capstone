import "react-native-get-random-values";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { BackHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveButton from "@/components/settings/edit-profile/SaveButton";
import { EditProfileSchema } from "@/zod/zod-schemas";
import ImageEditor from "@/components/settings/edit-profile/ImageEditor";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";

export default function EditProfileScreen() {
  // Declare form properties
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
  });

  // Fetch initial user data
  const { user } = useAuthData();
  if (!user?.id) return;
  const { data } = trpc.user.get_user_data.useQuery({ uuid: user.id });

  // Update form with fetched data
  const [formReady, setformReady] = useState(false);
  useEffect(() => {
    if (data) {
      setValue("username", data.username!);
      setValue("firstname", data.first_name!);
      setValue("lastname", data.last_name!);
      setValue("bio", data.bio! ?? "");
      setImageUri(data.avatar_url ?? undefined);
      setformReady(true);
    }
  }, [data, setValue]);

  // State to display current image on page
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  // State to determines whether image should be updated
  const [isNewImage, setIsNewImage] = useState<boolean>(false);

  if (!formReady || !data) {
    return <LoadingScreen backHeader />;
  }

  return (
    <>
      <BackHeader />
      <View style={styles.container} color="background">
        <View style={{ alignItems: "center" }}>
          <ImageEditor
            avatarUrl={data?.avatar_url ?? null}
            imageUri={imageUri}
            setImageUri={setImageUri}
            setIsNewImage={setIsNewImage}
          />
        </View>

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

        <SaveButton
          data={data as unknown as UserData}
          getValues={getValues}
          handleSubmit={handleSubmit}
          imageUri={imageUri}
          isNewImage={isNewImage}
        />
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
