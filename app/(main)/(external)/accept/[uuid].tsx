import { SimpleHeader } from "@/components/headers/Headers";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AcceptScreen() {
  const themeColor = useThemeColor();
  return (
    <>
      <SimpleHeader title="Accept job" />
      <ScrollView style={styles.page} color="background">
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Disclaimer
          </Text>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            Accepting this job does not guarentee you will be approved for it.
            The employer will consider all users who accept this job and proceed
            with who they choose. You cannot unaccept within 24 hours of the due
            date.
          </Text>
        </View>
        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            How much you'll receive
          </Text>
          <TrackTransactionEstimate />
        </View>

        <View
          color="background"
          style={{
            padding: 26,
          }}
        >
          <Text weight="semibold" size="lg">
            Link a service
          </Text>
          <TouchableOpacity
            //   onPress={() => {
            //     router.push({
            //       pathname: "/choose-address",
            //       params: {
            //         selected_address: JSON.stringify(address),
            //       },
            //     });
            //   }}
            style={[styles.linker, { borderColor: themeColor.foreground }]}
          >
            <View>
              <Text>No service linked</Text>
            </View>

            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            You can link a service for the employer to view. Their review will
            apply to both your account and service. You cannot unlink this
            service after it has already been accepted.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderColor: themeColor.border }]}>
        <Button style={styles.button}>Confirm accept</Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  linker: {
    marginTop: 10,
    paddingHorizontal: 20,
    height: 60,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  transaction: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 52,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    alignSelf: "flex-end",
  },
});
