import { SimpleHeader } from "@/components/headers/Headers";
import View from "@/components/ui/View";
import { StyleSheet } from "react-native";

// Addresses screen
export default function ConfirmApproveScreen() {
  return (
    <>
      <SimpleHeader title="Confirm approval" />
      <View style={{ flex: 1 }} color="base"></View>
    </>
  );
}

// Styles
const styles = StyleSheet.create({});
