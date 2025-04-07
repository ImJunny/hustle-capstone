import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Icon from "../ui/Icon";
import { StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/server/lib/supabase";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { usePostStore } from "@/hooks/usePostStore";
import { useFollowedStore } from "@/hooks/useFollowedStore";
import { useMessageStore } from "@/hooks/useMessageStore";

export default function LogOut() {
  const resetPosts = usePostStore((state) => state.reset);
  const resetMessages = useMessageStore((state) => state.reset);
  const resetFollowed = useFollowedStore((state) => state.reset);
  const resetStores = () => {
    resetPosts();
    resetMessages();
    resetFollowed();
  };
  const utils = trpc.useUtils();
  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    Toast.show({
      text1: error ? "Error signing out" : "Signed out",
      type: error ? "error" : "info",
      swipeable: false,
    });
    if (error) return;
    router.replace("/signin");
    await utils.invalidate();
    resetStores();
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
