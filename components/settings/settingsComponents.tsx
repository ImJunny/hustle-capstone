import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Icon from "../ui/Icon";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export function EditProfile() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <TouchableOpacity>
      <View style={[styles.entry, { borderColor }]}>
        <Icon name="person-outline" size="xl" />
        <Text style={styles.entryText}>Edit profile</Text>
        <Icon name="chevron-forward" size="xl" />
      </View>
    </TouchableOpacity>
  );
}
export function PersonalInformation() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <TouchableOpacity>
      <View style={[styles.entry, { borderColor }]}>
        <Icon name="information-circle-outline" size="xl" />
        <Text style={styles.entryText}>Personal information</Text>
        <Icon name="chevron-forward" size="xl" />
      </View>
    </TouchableOpacity>
  );
}

export function PaymentMethods() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <TouchableOpacity>
      <View style={[styles.entry, { borderColor }]}>
        <Icon name="card-outline" size="xl" />
        <Text style={styles.entryText}>Payment methods</Text>
        <Icon name="chevron-forward" size="xl" />
      </View>
    </TouchableOpacity>
  );
}

export function Notification() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <TouchableOpacity>
      <View style={[styles.entry, { borderColor }]}>
        <Icon name="notifications-outline" size="xl" />
        <Text style={styles.entryText}>Notifications</Text>
        <Icon name="chevron-forward" size="xl" />
      </View>
    </TouchableOpacity>
  );
}

export function LogOut() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  return (
    <TouchableOpacity>
      <View style={styles.lastEntry}>
        <Icon name="log-out-outline" size="xl" color="red" />
        <Text style={styles.lastText}>Log Out</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  entryText: {
    marginLeft: 12,
    marginRight: "auto",
  },
  lastText: {
    marginLeft: 12,
    marginRight: "auto",
    marginTop: 5,
    padding: 15,
    color: "red",
  },
  lastEntry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    color: "red",
  },
});
