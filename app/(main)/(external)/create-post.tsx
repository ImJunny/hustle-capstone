import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { CreatePostHeader } from "@/components/headers/Headers";
import Input from "@/components/ui/Input";
import DateInput from "@/components/ui/DateInput";
import AddImage from "@/components/ui/AddImages";
import Separator from "@/components/ui/Separator";

export default function PostForm() {
  return (
    <>
      <CreatePostHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={{ padding: 16 }}>
            <Text size="sm">
              Please do NOT include any sensitive information (phone numbers,
              emails, addresses, etc.) in photos, title, or description.
            </Text>

            <View style={{ marginTop: 30 }}>
              <Text weight="semibold" size="lg">
                Type
              </Text>

              <View style={{ marginTop: 10, flexDirection: "row", gap: 16 }}>
                <Button type="outline" style={{ flex: 1 }}>
                  Job
                </Button>
                <Button type="secondary" style={{ flex: 1 }}>
                  Service
                </Button>
              </View>
            </View>

            <Separator style={{ marginTop: 60, marginBottom: 60 }} />

            <View style={{ gap: 60 }}>
              <View>
                <Text weight="semibold" size="lg">
                  Title
                </Text>
                <Input type="outline" style={styles.text_form} />
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  Please provide a title of at least 10 characters.
                </Text>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Description
                </Text>
                <Input
                  type="outline"
                  multiline={true}
                  textAlignVertical="top"
                  style={styles.description_form}
                />
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  Please provide a description of at least 60 characters.
                </Text>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text weight="semibold" size="lg">
                      Min rate
                    </Text>
                    <Input type="outline" style={styles.rate_form} />
                  </View>
                  <Text>-</Text>
                  <View>
                    <Text weight="semibold" size="lg">
                      Max rate
                    </Text>
                    <Input
                      type="outline"
                      placeholder="optional"
                      style={styles.rate_form}
                    />
                  </View>
                </View>
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  The rate cannot be changed after a worker has been approved.
                </Text>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Location
                </Text>
                <View style={{ marginTop: 10, flexDirection: "row", gap: 16 }}>
                  <View style={styles.check_box}>
                    <IconButton name="checkbox" />
                    <Text>Local</Text>
                  </View>
                  <View style={styles.check_box}>
                    <IconButton name="square-outline" />
                    <Text>Remote</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Address
                </Text>
                <Input type="outline" style={styles.text_form} />
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  This address will be hidden to everyone except the approved
                  worker.
                </Text>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Due date
                </Text>
                <DateInput />
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  This indicates the date range for when the job can be
                  completed. You cannot make the due date earlier after a worker
                  is approved.
                </Text>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Photos
                </Text>
                <AddImage />
                <Text color="muted" size="sm">
                  Add up to 8 photos in JPEG or PNG format. If you do not
                  provide any images, a placeholder gradient will be displayed.
                </Text>
              </View>

              <View>
                <Text weight="semibold" size="lg">
                  Tags
                </Text>
                <Input type="outline" style={styles.text_form} />
                <Text color="muted" size="sm" style={{ marginTop: 10 }}>
                  This helps describe the job and narrows down search results.
                </Text>
              </View>

              <Button style={{ marginLeft: "auto" }}>Post job</Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  add_photo: {
    width: 80,
    height: 80,
    backgroundColor: "grey",
    alignItems: "center",
  },
  text_form: {
    marginTop: 10,
  },
  description_form: {
    marginTop: 10,
    textAlignVertical: "auto",
    height: 160,
    flexWrap: "wrap",
  },
  rate_form: {
    marginTop: 10,
    width: 120,
  },
  check_box: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
  },
});
