import React, { useState } from "react";
import View from "./View";
import {
  Image,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import IconButton from "./IconButton";
import ImagePlaceholder from "./ImagePlaceholder";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import Icon from "./Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "./ScrollView";

function AddImage() {
  const themeColor = useThemeColor();

  const [images, setImages] = useState<string[]>([]);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
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
    marginVertical: 10,
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

export default AddImage;
