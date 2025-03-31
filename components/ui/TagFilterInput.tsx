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
import { tagTypes } from "@/drizzle/db-types";

export default function TagFilterInput({
  data = tagTypes,
  setValue,
  name,
}: {
  data?: ReadonlyArray<{ name: string; value: string }>;
  setValue: UseFormSetValue<z.infer<typeof CreatePostSchema>>;
  getValues: UseFormSetValue<z.infer<typeof CreatePostSchema>>;
  name: keyof z.infer<typeof CreatePostSchema>;
}) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setValue(name, selectedTags);
  }, [selectedTags, setValue, name]);

  const addTag = (tagValue: string) => {
    if (!selectedTags.some((t) => t === tagValue)) {
      const updatedTags = [...selectedTags, tagValue];
      setSelectedTags(updatedTags);
      setSearch("");
    }
  };

  const removeTag = (tagValue: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tagValue);
    setSelectedTags(updatedTags);
    setSearch("");
  };

  const removeLastTag = () => {
    if (selectedTags.length > 0) {
      const lastTag = selectedTags[selectedTags.length - 1];
      removeTag(lastTag);
    }
  };

  const handleKeyPress = (e: any) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      search === "" &&
      selectedTags.length > 0
    ) {
      removeLastTag();
    }
  };

  // Get the display name for a tag value
  const getTagName = (tagValue: string) => {
    const tag = data.find((t) => t.value === tagValue);
    return tag ? tag.name : tagValue;
  };

  const filteredData = search
    ? data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          !selectedTags.some((t) => t === item.value)
      )
    : [];

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
          {selectedTags.map((tagValue) => (
            <TouchableOpacity
              key={tagValue}
              onPress={() => removeTag(tagValue)}
            >
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
                <Text color="background">{getTagName(tagValue)} ✕</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }}>
            <TextInput
              ref={inputRef}
              value={search}
              onChangeText={(text) => setSearch(text)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsDropdownVisible(true)}
              placeholder={selectedTags.length > 0 ? "" : "Search tags..."}
              placeholderTextColor={themeColor.muted}
              autoCapitalize="none"
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
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: themeColor.background,
              borderWidth: 2,
              borderColor: themeColor.border,
              borderRadius: 6,
              flexDirection: "column-reverse",
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
                    addTag(item.value);
                    setIsDropdownVisible(true);
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
