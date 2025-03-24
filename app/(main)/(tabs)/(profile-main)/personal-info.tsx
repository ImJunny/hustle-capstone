import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { BackHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";

export default function PersonalInfo() {
  const { user } = useAuthData();
  const [personalInfo, setPersonalInfo] = useState<{
    email: string;
    createdAt: string;
  } | null>(null);

  const { data, isLoading } = trpc.user.get_personal_info.useQuery(
    { uuid: user?.id ?? "" },
    { enabled: !!user?.id }
  );

  const fetchedPersonalInfo = data
    ? {
        email: data.email!,
        createdAt: new Date(data.created_at!).toLocaleString(),
      }
    : null;

  if (isLoading || !fetchedPersonalInfo) {
    return <LoadingView backHeader />;
  }

  return (
    <>
      <BackHeader />
      <View style={styles.container} color="background">
        <Text weight="bold" size="lg">
          Personal Information
        </Text>
        <View style={styles.infoEntry}>
          <Text weight="bold">Email:</Text>
          <Text>{fetchedPersonalInfo.email}</Text>
        </View>
        <View style={styles.infoEntry}>
          <Text weight="bold">Account Created:</Text>
          <Text>{fetchedPersonalInfo.createdAt}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  infoEntry: {
    marginVertical: 8,
  },
});
