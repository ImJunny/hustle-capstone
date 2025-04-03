import Icon from "@/components/ui/Icon";
import View from "@/components/ui/View";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Text from "../ui/Text";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Buffer } from "buffer";
import { OnboardingFormSchema } from "@/zod/zod-schemas";
import { z } from "zod";

// Component that allows user to edit their image
export default function OnboardingImageEditor() {
  const { setValue }: UseFormReturn<z.infer<typeof OnboardingFormSchema>> =
    useFormContext();
  const [imageUri, setImageUri] = useState<string | undefined>();
  // Function to chooses image
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      let compressedImageUri = await compressImage(
        result.assets[0].uri,
        128,
        128
      );
      setImageUri(result.assets[0].uri);
      const file = await fetch(compressedImageUri);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      setValue("image_buffer", buffer);
    }
  }

  function clearImage() {
    setImageUri(undefined);
    setValue("image_buffer", null);
  }

  // Function that compresses image and updates imageUri
  async function compressImage(uri: string, width: number, height: number) {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    return resizedImage.uri;
  }

  const { width } = Dimensions.get("window");
  return (
    <View>
      <View>
        <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
          <Image
            source={
              imageUri
                ? {
                    uri: imageUri,
                  }
                : require("@/assets/images/default-avatar-icon.jpg")
            }
            style={{
              borderRadius: 999,
              width: width * 0.75,
              height: width * 0.75,
            }}
          />
        </TouchableOpacity>
        <View style={styles.cameraIconCircle} color="background-variant">
          <Icon name="camera-outline" size="2xl" />
        </View>
      </View>
      {imageUri && (
        <Text
          size="lg"
          color="muted"
          style={styles.removeText}
          onPress={clearImage}
        >
          Remove image
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 999,
    width: 90,
    height: 90,
  },
  cameraIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  removeText: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
