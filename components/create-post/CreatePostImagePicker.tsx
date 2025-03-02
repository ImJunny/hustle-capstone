import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColor } from "@/hooks/useThemeColor";
import View from "../ui/View";
import Icon from "../ui/Icon";
import { UseFormSetValue } from "react-hook-form";
import { CreateJobSchema, CreateServiceSchema } from "@/zod/zod-schemas";
import { z } from "zod";

type CreatePostImagePickerProps = {
  setValue:
    | UseFormSetValue<z.infer<typeof CreateJobSchema>>
    | UseFormSetValue<z.infer<typeof CreateServiceSchema>>;
};
function CreatePostImagePicker({ setValue }: CreatePostImagePickerProps) {
  const themeColor = useThemeColor();

  const [images, setImages] = useState<string[]>([]);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
      (setValue as UseFormSetValue<z.infer<typeof CreateJobSchema>>)(
        "images",
        [...images, result.assets[0].uri],
        {
          shouldValidate: true,
        }
      );
    }
  }

  async function deleteImage(index: number) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <View key={index}>
            <Image
              source={{ uri: `${imageUri}?=${new Date().getTime()}` }}
              style={styles.image}
            />
            <TouchableOpacity
              style={[
                styles.deleteContainer,
                { backgroundColor: themeColor.background },
              ]}
              onPress={() => deleteImage(index)}
            >
              <Icon name="close" size="lg" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 6 && (
          <TouchableOpacity
            onPress={() => pickImage()}
            style={[styles.add_photo, { borderColor: themeColor.foreground }]}
          >
            <Icon name="add" size="2xl" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
  },
  add_photo: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderWidth: 3,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  deleteContainer: {
    position: "absolute",
    top: 2,
    right: 2,
    borderRadius: 999,
    padding: 4,
  },
  deleteIcon: {},
});

export default CreatePostImagePicker;
