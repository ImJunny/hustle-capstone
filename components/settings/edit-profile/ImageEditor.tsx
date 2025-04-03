import Icon from "@/components/ui/Icon";
import View from "@/components/ui/View";
import { Image } from "expo-image";
import { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { compressImage, getImageHash } from "@/server/utils/image-methods";
import AvatarImage from "@/components/ui/AvatarImage";

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
  // Function to choose image
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
      setImageUri(compressedImageUri);
      let oldHash;
      if (avatarUrl) oldHash = await getImageHash(avatarUrl!);
      let newHash = await getImageHash(compressedImageUri);
      if (oldHash !== newHash) setIsNewImage(true);
    }
  }

  return (
    <View style={{}}>
      <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
        <AvatarImage url={imageUri} size={90} />
      </TouchableOpacity>
      <Pressable onPress={pickImage}>
        <View style={styles.cameraIconCircle} color="background-variant">
          <Icon name="camera-outline" size="lg" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
