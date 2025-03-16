import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Icon from "../ui/Icon";
import { StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/server/lib/supabase";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";

export default function LogOut() {
  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    Toast.show({
      text1: error ? "Error signing out" : "Signed out",
      type: error ? "error" : "info",
      swipeable: false,
    });
    if (error) return;
    router.replace("/signin");
    const utils = trpc.useUtils();
    await utils.invalidate();
  }

  return (
    <TouchableOpacity onPress={handleSignout}>
      <View style={styles.lastEntry}>
        <Icon name="log-out-outline" size="xl" color="red" />
        <Text style={styles.lastText}>Log out</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lastEntry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    color: "red",
    marginTop: 10,
  },
  lastText: {
    marginLeft: 12,
    color: "red",
  },
});
