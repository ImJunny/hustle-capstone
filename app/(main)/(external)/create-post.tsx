import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { CreatePostHeader } from "@/components/headers/Headers";
import PostForm from "@/components/posts/PostForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CreatePostProvider } from "@/contexts/CreatePostContext";
import PostSubmitButton from "@/components/posts/PostSubmitButton";

export default function CreatePostForm() {
  const themeColor = useThemeColor();

  return (
    <CreatePostProvider>
      <CreatePostHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.page}>
            <Text size="sm" style={{ marginBottom: 30 }}>
              Please do NOT include any sensitive information (phone numbers,
              emails, addresses, etc.).
            </Text>
            <PostForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <PostSubmitButton />
      </View>
    </CreatePostProvider>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  typeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  buttonRow: { marginTop: 10, flexDirection: "row", gap: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
