import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CreatePostHeader, SimpleHeader } from "@/components/headers/Headers";
import PostForm from "@/components/posts/PostForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CreatePostProvider } from "@/contexts/CreatePostContext";
import PostSubmitButton from "@/components/posts/PostSubmitButton";
import { useLocalSearchParams } from "expo-router";

export default function CreatePostForm() {
  const themeColor = useThemeColor();
  const { type } = useLocalSearchParams();

  const data = [
    {
      id: "notice",
      component: (
        <Text size="sm" style={{ marginBottom: 30 }}>
          Please do NOT include any sensitive information (phone numbers,
          emails, addresses, etc.).
        </Text>
      ),
    },
    { id: "form", component: <PostForm type={type as "work" | "hire"} /> },
  ];

  return (
    <CreatePostProvider type={(type as "work" | "hire") ?? undefined}>
      {type === "hire" ? (
        <SimpleHeader title="Create a service" />
      ) : (
        <CreatePostHeader />
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.component}
          contentContainerStyle={styles.page}
        />
      </KeyboardAvoidingView>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <PostSubmitButton />
      </View>
    </CreatePostProvider>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
