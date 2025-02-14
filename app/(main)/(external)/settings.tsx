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
import ScrollView from "@/components/ui/ScrollView";

export default function SettingsScreen() {
  return (
    <>
      <SettingsHeader />
      <ScrollView color="background">
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  category: {
    marginBottom: 12,
  },
});
