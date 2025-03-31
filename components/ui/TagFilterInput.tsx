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
import View from "./View";
import { tagTypes } from "@/drizzle/db-types";
import { TColors } from "@/constants/Colors";

export default function TagFilterInput({
  data = tagTypes,
  value = [],
  onChange,
  borderColor = "border",
  limit,
}: {
  data?: ReadonlyArray<{ name: string; value: string }>;
  value: string[];
  onChange: (tags: string[]) => void;
  borderColor?: TColors;
  limit?: number;
}) {
  const [search, setSearch] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const themeColor = useThemeColor();
  const color = themeColor[borderColor];
  const addTag = (tagValue: string) => {
    if (!value.includes(tagValue)) {
      onChange([...value, tagValue]);
      setSearch("");
    }
  };

  const removeTag = (tagValue: string) => {
    onChange(value.filter((t) => t !== tagValue));
    setSearch("");
  };

  const removeLastTag = () => {
    if (value.length > 0) {
      const lastTag = value[value.length - 1];
      removeTag(lastTag);
    }
  };

  const handleKeyPress = (e: any) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      search === "" &&
      value.length > 0
    ) {
      removeLastTag();
    }
  };

  const getTagName = (tagValue: string) => {
    const tag = data.find((t) => t.value === tagValue);
    return tag ? tag.name : tagValue;
  };

  const filteredData = search
    ? data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          !value.includes(item.value)
      )
    : [];

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
          borderColor: color,
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
          {value.map((tagValue) => (
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
              placeholder={value.length > 0 ? "" : "Search tags..."}
              placeholderTextColor={themeColor.muted}
              autoCapitalize="none"
              style={{
                flex: 1,
                padding: 5,
                width: "100%",
                color: themeColor.foreground,
              }}
              editable={limit ? value.length < limit : true}
            />
          </View>
        </View>
      </View>

      {isDropdownVisible && filteredData.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: themeColor.background,
            borderWidth: 1,
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
      )}
    </View>
  );
}
