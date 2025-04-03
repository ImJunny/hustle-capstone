import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import PostForm from "@/components/posts/PostForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CreatePostProvider } from "@/contexts/CreatePostContext";
import PostSubmitButton from "@/components/posts/PostSubmitButton";
import { useLocalSearchParams } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { FlatList } from "react-native-gesture-handler";
import { useAuthData } from "@/contexts/AuthContext";

export default function CreatePostForm() {
  const { uuid } = useLocalSearchParams();
  const { user } = useAuthData();
  const { data } = trpc.post.get_post_details_info.useQuery({
    uuid: uuid as string,
    user_uuid: user?.id as string,
  });
  const themeColor = useThemeColor();

  const flatListData = [
    {
      id: "notice",
      component: (
        <Text size="sm" style={{ marginBottom: 30 }}>
          Please do NOT include any sensitive information (phone numbers,
          emails, addresses, etc.).
        </Text>
      ),
    },
    { id: "form", component: <PostForm /> },
  ];

  return (
    <CreatePostProvider data={data as unknown as PostDetailsInfo}>
      <SimpleHeader title="Edit post" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={flatListData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.component}
          contentContainerStyle={styles.page}
        />
      </KeyboardAvoidingView>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <PostSubmitButton uuid={uuid as string} isEditing />
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
