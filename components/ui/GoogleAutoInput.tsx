import { FontSizes } from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { Dispatch, LegacyRef, SetStateAction } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

type GoogleAutoInputProps = {
  setGeocode: Dispatch<SetStateAction<[number, number] | null>>;
  googleInputRef: LegacyRef<GooglePlacesAutocompleteRef>;
};

export default function GoogleAutoInput({
  setGeocode,
  googleInputRef,
}: GoogleAutoInputProps) {
  const themeColor = useThemeColor();

  return (
    <GooglePlacesAutocomplete
      ref={googleInputRef}
      placeholder="Search from this location"
      fetchDetails={true}
      textInputProps={{
        placeholderTextColor: themeColor.muted,
      }}
      onPress={(data, details = null) => {
        if (details) {
          const { lat, lng } = details.geometry.location;
          setGeocode([lat, lng]);
        }
      }}
      query={{
        key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        language: "en",
      }}
      styles={{
        textInput: {
          backgroundColor: themeColor.transparent,
          color: themeColor.foreground,
          borderWidth: 1,
          borderColor: themeColor.border,
          borderRadius: 6,
          fontSize: FontSizes.md,
          paddingHorizontal: 12,
        },
        description: {
          color: themeColor.foreground,
          fontSize: FontSizes.md,
        },
        separator: {
          backgroundColor: themeColor.border,
        },
        poweredContainer: {
          display: "none",
        },
        row: {
          backgroundColor: themeColor.transparent,
        },
      }}
    />
  );
}
