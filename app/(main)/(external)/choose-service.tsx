import {
  ChooseServiceHeader,
  SimpleHeader,
} from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { router, useLocalSearchParams } from "expo-router";
import { Post } from "@/server/actions/post-actions";
import { Image } from "expo-image";
import ScrollView from "@/components/ui/ScrollView";

// Addresses screen
export default function ChooseServiceScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  if (!user) return;

  const { data: services, isLoading } = trpc.post.get_user_posts.useQuery({
    uuid: user.id,
    type: "hire",
  });

  const { selected_service } = useLocalSearchParams();
  const [currentService, setCurrentService] = useState<Post | null>(
    selected_service ? JSON.parse(selected_service as string) : null
  );

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Link a service" />
        <LoadingView />
      </>
    );
  }

  if (!services) {
    return (
      <>
        <SimpleHeader title="Link a service" />
        <View style={styles.centerPage}>
          <Text weight="semibold" size="2xl">
            No services added yet
          </Text>
          <Text>Add a service by clicking on the add button at the top</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <ChooseServiceHeader />
      <ScrollView style={{ flex: 1 }} color="base">
        <TouchableOpacity onPress={() => setCurrentService(null)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 100,
              paddingHorizontal: 16,
              alignItems: "center",
              borderBottomWidth: 1,
            }}
            color="black"
          >
            <Text weight="semibold" size="lg">
              None
            </Text>
            <RadioButton value={null} selected={currentService} disabled />
          </View>
        </TouchableOpacity>
        {services.map((service, i) => (
          <ServiceEntry
            key={i}
            service={service as Post}
            currentService={currentService}
            setCurrentService={setCurrentService}
          />
        ))}
      </ScrollView>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <Button
          style={{ alignSelf: "flex-end" }}
          onPress={() => {
            router.back();
            router.setParams({
              selected_service: JSON.stringify(currentService),
            });
          }}
        >
          Select service
        </Button>
      </View>
    </>
  );
}

// Address entry components
type ServiceEntryProps = {
  service: Post;
  currentService: Post | null;
  setCurrentService: Dispatch<SetStateAction<Post | null>>;
};

function ServiceEntry({
  service,
  currentService,
  setCurrentService,
}: ServiceEntryProps) {
  const themeColor = useThemeColor();
  return (
    <TouchableOpacity onPress={() => setCurrentService(service)}>
      <View
        color="background"
        style={[styles.entry, { borderColor: themeColor.border }]}
      >
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Image
            source={{ uri: service.image_url }}
            style={{ width: 68, height: 68, borderRadius: 4 }}
          />
          <View style={{ justifyContent: "center" }}>
            <Text weight="semibold" size="lg">
              {service.title}
            </Text>
          </View>
        </View>
        <RadioButton
          value={service.uuid}
          selected={currentService?.uuid}
          disabled
        />
      </View>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  centerPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    padding: 16,
  },
  page: { padding: 16 },
  typeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  buttonRow: { marginTop: 10, flexDirection: "row", gap: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
