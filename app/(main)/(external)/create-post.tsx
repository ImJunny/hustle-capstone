import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState } from "react";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Button from "@/components/ui/Button";
import { CreatePostHeader } from "@/components/headers/Headers";
import Separator from "@/components/ui/Separator";
import CreateJobForm from "@/components/create-post/CreateJobForm";
import CreateServiceForm from "@/components/create-post/CreateServiceForm";

export default function PostForm() {
  const [postType, setPostType] = useState<"job" | "service">("job");

  return (
    <>
      <CreatePostHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.page}>
            <Text size="sm">
              Please do NOT include any sensitive information (phone numbers,
              emails, addresses, etc.) in photos, title, or description.
            </Text>

            <View style={styles.typeContainer}>
              <Text weight="semibold" size="lg">
                Type
              </Text>

              <View style={styles.buttonRow}>
                <Button
                  type={postType === "job" ? "primary" : "secondary"}
                  style={styles.button}
                  onPress={() => setPostType("job")}
                >
                  Job
                </Button>
                <Button
                  type={postType === "service" ? "primary" : "secondary"}
                  style={styles.button}
                  onPress={() => setPostType("service")}
                >
                  Service
                </Button>
              </View>
            </View>

            <Separator style={{ marginTop: 30, marginBottom: 30 }} />

            {postType === "job" ? <CreateJobForm /> : <CreateServiceForm />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  typeContainer: { marginTop: 30 },
  buttonRow: { marginTop: 10, flexDirection: "row", gap: 16 },
  button: {
    flex: 1,
  },
});
