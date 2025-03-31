import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "./Text";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { CreatePostSchema } from "@/zod/zod-schemas";
import View from "./View";

export default function TagFilterInput({
  data,
  setValue,
  getValues,
  name,
}: {
  data: { name: string; value: string }[];
  setValue: UseFormSetValue<z.infer<typeof CreatePostSchema>>;
  getValues: UseFormSetValue<z.infer<typeof CreatePostSchema>>;
  name: keyof z.infer<typeof CreatePostSchema>;
}) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<
    { name: string; value: string }[]
  >([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    setValue(name, selectedTags);
  }, [selectedTags, setValue, name]);

  const addTag = (tag: { name: string; value: string }) => {
    if (!selectedTags.some((t) => t.value === tag.value)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      setSearch("");
    }
  };

  const removeTag = (tag: { name: string; value: string }) => {
    const updatedTags = selectedTags.filter((t) => t.value !== tag.value);
    setSelectedTags(updatedTags);
    setSearch("");
  };

  const filteredData = search
    ? data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          !selectedTags.some((t) => t.value === item.value)
      )
    : []; // Empty array when no search is active or no filter matches

  const themeColor = useThemeColor();

  useEffect(() => {
    if (filteredData.length > 0 && search.trim()) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [filteredData, search]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          height: 40,
          borderRadius: 6,
          borderColor: "white",
          borderWidth: 1,
          paddingLeft: 8,
          paddingRight: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {selectedTags.map((tag) => (
            <TouchableOpacity key={tag.value} onPress={() => removeTag(tag)}>
              <View
                color="foreground"
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  height: 30,
                  borderRadius: 15,
                  marginRight: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text color="background">{tag.name} ✕</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }}>
            <TextInput
              value={search}
              onChangeText={(text) => setSearch(text)}
              onFocus={() => setIsDropdownVisible(true)}
              placeholder={selectedTags.length > 0 ? "" : "Search tags..."}
              placeholderTextColor={themeColor.muted}
              style={{
                flex: 1,
                padding: 5,
                width: "100%",
                color: themeColor.foreground,
              }}
              editable={selectedTags.length < 3}
            />
          </View>
        </View>
      </View>

      {isDropdownVisible && filteredData.length > 0 && (
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          accessible={false}
        >
          <View
            style={{
              position: "absolute", // Position dropdown above input
              bottom: 60, // Adjust based on input's position
              left: 0,
              right: 0,
              zIndex: 1, // Ensure it appears above other elements
              backgroundColor: themeColor.background,
              borderWidth: 2,
              borderColor: themeColor.border,
              borderRadius: 6,
              flexDirection: "column-reverse", // Reverse the direction of the list items
            }}
          >
            <FlatList
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              data={filteredData}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    addTag(item);
                    setIsDropdownVisible(true); // Keep dropdown open
                  }}
                  style={{
                    padding: 10,
                    backgroundColor: themeColor.background,
                    borderBottomWidth: 1,
                    borderColor: themeColor.border,
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
