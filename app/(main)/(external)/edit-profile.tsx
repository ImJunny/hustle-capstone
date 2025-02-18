import "react-native-get-random-values";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { BackHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserData, updateUserProfile } from "@/server/lib/user";
import Toast from "react-native-toast-message";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import Icon from "@/components/ui/Icon";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.EXPO_PUBLIC_AWS_REGION as string,
});
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
  const { data } = useQuery({
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

  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  async function pickImage() {
    console.log("clicked");
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      const file = await fetch(result.assets[0].uri);
      const fileBlob = await file.blob();
      const params = {
        Bucket: process.env.EXPO_PUBLIC_AWS_BUCKET_NAME,
        Key: result.assets[0].fileName,
        Body: fileBlob,
        ContentType: result.assets[0].type,
      };
      try {
        const command = new PutObjectCommand(params); // Create the PutObjectCommand
        console.log("Image uploaded successfully:");
        await s3.send(command);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

  if (!formReady) {
    return <LoadingScreen backHeader />;
  }
  return (
    <>
      <BackHeader />
      <View style={styles.container} color="background">
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : require("@/assets/images/default-avatar-icon.jpg")
              }
              width={90}
              height={90}
              style={{ borderRadius: 999, width: 90, height: 90 }}
            />

            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
              color="background-variant"
            >
              <Icon name="camera-outline" size="lg" />
            </View>
          </TouchableOpacity>
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
