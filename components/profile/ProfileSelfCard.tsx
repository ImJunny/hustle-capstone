import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import { UserData } from "@/server/lib/user";
import { router } from "expo-router";
import { Image } from "expo-image";

export default function ProfileSelfCard({ data }: { data: UserData }) {
  return (
    <View style={styles.profileCard} color="background">
      <View style={styles.top}>
        <View>
          <Image
            source={
              data.avatar_url
                ? {
                    uri: `${data?.avatar_url}?t=${new Date().getTime()}`,
                  }
                : require("@/assets/images/default-avatar-icon.jpg")
            }
            style={{ borderRadius: 999, width: 96, height: 96 }}
          />
          <Icon name="checkmark-circle" size="xl" style={styles.checkmark} />
        </View>

        <View style={styles.topInnerRight}>
          <Text color="foreground" size="xl" weight="semibold">
            {data?.first_name} {data?.last_name}
          </Text>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Icon name={"star"} color="foreground" />
            <Icon name={"star"} color="foreground" />
            <Icon name={"star"} color="foreground" />
            <Icon name={"star"} color="foreground" />
            <Icon name={"star-half"} color="foreground" />
            <Text size="lg" style={{ textDecorationLine: "underline" }}>
              7 Reviews
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={{ flex: 1, height: 32 }}
              type="variant"
              onPress={() => router.push("/edit-profile")}
            >
              Edit profile
            </Button>
            <Button style={{ flex: 1, height: 32 }}>Follow</Button>
          </View>
        </View>
      </View>
      <Text color={data.bio ? "foreground" : "muted"} style={{ marginTop: 24 }}>
        {data.bio ? data!.bio : "Add a biography in profile settings."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 230,
  },
  top: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-start",
  },
  topInnerRight: {
    gap: 4,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    width: "100%",
  },
  checkmark: {
    position: "absolute",
    right: 2,
    bottom: 2,
  },
});
