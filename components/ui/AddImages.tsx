import React, { useState } from "react";
import View from "./View";
import { Image, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import IconButton from "./IconButton";
import ImagePlaceholder from "./ImagePlaceholder";

const AddImage = () => {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = () => {
    if (images.length >= 8) {
      Alert.alert("Limit Reached", "You can only upload up to 8 images.");
      return;
    }

    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImageUri = response.assets[0].uri;
        if (newImageUri) {
          setImages((prevImages) => [...prevImages, newImageUri]);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Pressable onPress={pickImage} style={styles.add_photo}>
          <IconButton name="add" size="2xl" />
        </Pressable>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  image: {
    width: 90,
    height: 90,
    gap: 10,
  },
  add_photo: {
    width: 90,
    height: 90,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
});

export default AddImage;
