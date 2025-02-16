import React, { useState } from "react";
import View from "./ui/View";
import { Image, StyleSheet, ScrollView, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import IconButton from "./ui/IconButton";
import ImagePlaceholder from "./ui/ImagePlaceholder";

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
      <View style={styles.add_photo}>
        <IconButton
          onPress={pickImage}
          name="add"
          size="2xl"
          style={{ marginVertical: 34 }}
        />
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.imageContainer}
      >
        <ImagePlaceholder width={100} height={100} />
        <ImagePlaceholder width={100} height={100} />
        <ImagePlaceholder width={100} height={100} />
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </ScrollView>
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
    width: 100,
    height: 100,
    gap: 10,
  },
  add_photo: {
    width: 100,
    height: 100,
    backgroundColor: "grey",
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export default AddImage;
