import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { CreatePostsHeader } from "@/components/headers/Headers";
import Input from "@/components/ui/Input";
import DateInput from "@/components/ui/DateInput";
import AddImage from "@/components/AddImages";

export default function PostForm() {
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <CreatePostsHeader />
        <ScrollView>
          <View style={{ padding: 20, marginTop: 15 }}>
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                color="muted-dark"
                size="sm"
              >
                Please do NOT include any sensitive information (phone numbers,
                emails, addresses) in photos, title, or description.
              </Text>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Photos
              </Text>
              <AddImage />
              <Text color="muted-dark" size="sm">
                Add up to 8 photos in JPEG or PNG format.
              </Text>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Title
              </Text>
              <Input style={styles.text_form} />
              <View style={{ marginTop: 10 }}>
                <Text color="muted-dark" size="sm">
                  Please provide a title of at least 10 characters.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Desrcription
              </Text>
              <Input
                multiline={true}
                textAlignVertical="top"
                style={styles.description_form}
              />
              <View style={{ marginTop: 10 }}>
                <Text color="muted-dark" size="sm">
                  Please provide a description of at least 60 characters.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Rate ($)
              </Text>
              <Input placeholder="$ " style={styles.rate_form} />
              <View style={{ marginTop: 10 }}>
                <Text color="muted-dark" size="sm">
                  The rate cannot be changed after a worker has been approved.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Location
              </Text>
              <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
                <View style={styles.check_box}>
                  <IconButton name="checkbox" />
                  <Text>Local</Text>
                </View>
                <View style={styles.check_box}>
                  <IconButton name="checkbox" />
                  <Text>Remote</Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Address
              </Text>
              <Input style={styles.text_form} />
              <View style={{ marginTop: 10 }}>
                <Text color="muted-dark" size="sm">
                  This address will be hidden to everyone except the worker.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Date Range
              </Text>
              <DateInput />
              <View style={{ marginTop: 10 }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  color="muted-dark"
                  size="sm"
                >
                  This indicates the date range for when the job can be
                  completed. You cannot make the due date earlier after a worker
                  is approved.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text color="white" weight="semibold" size="lg">
                Tags
              </Text>
              <Input style={styles.text_form} />
              <View style={{ marginTop: 10 }}>
                <Text color="muted-dark" size="sm">
                  This helps describe the job and narrows down search results.
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 40,
                flexDirection: "row-reverse",
                marginBottom: 100,
              }}
            >
              <Button>Post Job</Button>
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
    width: 100,
    height: 100,
    backgroundColor: "grey",
    alignItems: "center",
  },
  text_form: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 0,
    marginTop: 10,
  },
  description_form: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 0,
    marginTop: 10,
    textAlignVertical: "auto",
    height: 160,
    flexWrap: "wrap",
  },
  rate_form: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 0,
    marginTop: 10,
    width: 150,
  },
  check_box: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
  },
});
