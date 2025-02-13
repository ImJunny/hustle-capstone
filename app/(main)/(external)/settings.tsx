import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { SettingsHeader } from "@/components/headers/Headers";
import { StyleSheet } from "react-native";
import {
  EditProfile,
  LogOut,
  Notification,
  PaymentMethods,
  PersonalInformation,
} from "@/components/settings/settingsComponents";

export default function SettingsScreen() {
  return (
    <>
      <SettingsHeader />

      <View style={styles.screen} color="background">
        <View style={styles.category}>
          <Text size="xl" weight="semibold">
            Account
          </Text>
        </View>
        <EditProfile />
        <PersonalInformation />
        <PaymentMethods />
      </View>

      <View style={styles.screen} color="background">
        <View style={styles.category}>
          <Text size="xl" weight="semibold">
            Activity
          </Text>
        </View>
        <Notification />
        <LogOut />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  category: {
    marginBottom: 12,
  },
});
