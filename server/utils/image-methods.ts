import Icon from "@/components/ui/Icon";
import View from "@/components/ui/View";
import { Image } from "expo-image";
import { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

// Function that compresses image
export async function compressImage(
  uri: string,
  width: number,
  height: number
) {
  const resizedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  );
  return resizedImage.uri;
}

// Function that gets hash of old image and new image; used to determine
// if the image has changed. This prevents an unnecessary update to S3.
export async function getImageHash(imageUri: string) {
  try {
    let fileUri = imageUri;
    let fileData = "";

    if (imageUri.startsWith("file://")) {
      fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      const localUri = FileSystem.cacheDirectory + "img.jpg";
      const { uri } = await FileSystem.downloadAsync(imageUri, localUri);
      fileData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      fileData,
      {
        encoding: Crypto.CryptoEncoding.HEX,
      }
    );
    return hash;
  } catch (error) {
    console.log("Error hashing image:", error);
  }
}
