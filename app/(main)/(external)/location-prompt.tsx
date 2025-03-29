import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";

export default function LocationPrompt() {
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      router.push("/(main)/(tabs)");
      return;
    }
  }

  return (
    <SafeAreaView style={[styles.page]} color="background">
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="map" size="4xl" style={{ alignSelf: "center" }} />
        </View>
        <View>
          <Text size="2xl" weight="semibold" style={{ marginTop: 24 }}>
            We'll need access to your location
          </Text>

          <Text style={{ marginTop: 2 }}>
            We require your location in order to suggest relevant posts. We do
            not share information across other services and ensure your data
            will be safe.{`\n\n`}If you decide to deny permissions for us to
            access your location, you can always change your mind by updating
            this permission in your device's application settings.
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          type="secondary"
          borderColor="foreground"
          onPress={() => router.push("/(main)/(tabs)")}
        >
          Maybe later
        </Button>
        <Button
          style={{ flexGrow: 1, borderRadius: 999 }}
          onPress={getCurrentLocation}
        >
          Allow
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: "auto",
    borderRadius: 999,
    width: "100%",
  },
});
