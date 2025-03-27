import { SimpleHeader } from "@/components/headers/Headers";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Post } from "@/server/actions/post-actions";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AcceptScreen() {
  const themeColor = useThemeColor();
  const [service, setService] = useState<Post | null>(null);

  const { selected_service } = useLocalSearchParams();
  useEffect(() => {
    if (selected_service) {
      const parsedService = JSON.parse(selected_service as string) as Post;
      setService(parsedService);
      // setValue("address_uuid", parsedAddress.uuid);
    }
  }, [selected_service]);

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
            Link a service (optional)
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/choose-service",
                params: {
                  selected_address: JSON.stringify(service),
                },
              });
            }}
            style={[styles.linker, { borderColor: themeColor.foreground }]}
          >
            <View>
              {service ? (
                <View>
                  <Text>{service.title}</Text>
                </View>
              ) : (
                <Text color="muted">None</Text>
              )}
            </View>

            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
          <Text size="sm" style={{ marginTop: 4 }} color="muted">
            You can link a service which can be viewed by the employer. Their
            review will apply to both your account and service. You cannot
            unlink this service after it has already been accepted.
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
