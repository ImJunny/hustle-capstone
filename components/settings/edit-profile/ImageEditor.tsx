import Icon from "@/components/ui/Icon";
import View from "@/components/ui/View";
import { Image } from "expo-image";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

type ImageEditorProps = {
  avatarUrl: string | null;
  imageUri: string | undefined;
  setImageUri: Dispatch<SetStateAction<string | undefined>>;
  setIsNewImage: Dispatch<SetStateAction<boolean>>;
};

// Component that allows user to edit their image
export default function ImageEditor({
  avatarUrl,
  imageUri,
  setImageUri,
  setIsNewImage,
}: ImageEditorProps) {
  // Function to chooses image
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      let compressedImageUri = await compressImage(result.assets[0].uri);
      setImageUri(compressedImageUri);
      let oldHash;
      if (avatarUrl) oldHash = await getImageHashes(avatarUrl!);
      let newHash = await getImageHashes(compressedImageUri);
      if (oldHash !== newHash) setIsNewImage(true);
    }
  }

  // Function that compresses image and updates imageUri
  async function compressImage(uri: string) {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 128, height: 128 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    return resizedImage.uri;
  }

  // Function that gets hash of old image and new image; used to determine
  // if the image has changed. This prevents an unnecessary update to s3
  async function getImageHashes(imageUri: string) {
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

  return (
    <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
      <Image
        source={
          imageUri
            ? {
                uri: imageUri,
              }
            : require("@/assets/images/default-avatar-icon.jpg")
        }
        style={styles.image}
      />
      <View style={styles.cameraIconCircle} color="background-variant">
        <Icon name="camera-outline" size="lg" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 999,
    width: 90,
    height: 90,
  },
  cameraIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
