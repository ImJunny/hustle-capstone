import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { SettingsHeader } from "@/components/headers/Headers";
import { StyleSheet, TouchableOpacity } from "react-native";
import Logout from "@/components/settings/Logout";
import ScrollView from "@/components/ui/ScrollView";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon, { IconSymbolName } from "@/components/ui/Icon";

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
            <View style={{ gap: 10 }}>
              <SettingsEntry
                name="person-outline"
                title="Edit profile"
                onPress={() => {
                  router.push("/edit-profile");
                }}
              />
              <SettingsEntry
                name="information-circle-outline"
                title="Personal information"
                onPress={() => {
                  router.push("/personal-info");
                }}
              />
              <SettingsEntry
                name="card-outline"
                title="Payment methods"
                onPress={() => {
                  router.push("/payment-methods");
                }}
              />
              <SettingsEntry
                name="location-outline"
                title="Addresses"
                onPress={() => {
                  router.push("/addresses");
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.screen} color="background">
          <View style={styles.category}>
            <Text size="xl" weight="semibold">
              Activity
            </Text>
            <View style={{ gap: 10 }}>
              <SettingsEntry
                name="notifications-outline"
                title="Notifications"
                onPress={() => {}}
              />
              <Logout />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function SettingsEntry({
  name,
  title,
  onPress,
}: {
  name: IconSymbolName;
  title: string;
  onPress: () => void;
}) {
  const themeColor = useThemeColor();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.entry, { borderColor: themeColor.border }]}>
        <Icon name={name} size="xl" />
        <Text style={styles.entryText}>{title}</Text>
        <Icon name="chevron-forward" size="xl" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  category: {
    marginBottom: 12,
    gap: 10,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  entryText: {
    marginLeft: 12,
    marginRight: "auto",
  },
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
