import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { UserData } from "@/server/actions/user-actions";
import { useThemeColor } from "@/hooks/useThemeColor";
import FollowButton from "./FollowButton";
import AvatarImage from "../ui/AvatarImage";

export default function ProfileCard({
  data,
  isSelf,
}: {
  data: UserData;
  isSelf?: boolean;
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.profileCard, { borderColor }]} color="background">
      <View style={styles.top}>
        <View>
          <AvatarImage url={data.avatar_url} size={96} />
        </View>

        <View style={styles.topInnerRight}>
          <Text color="foreground" size="xl" weight="semibold">
            {data?.display_name}
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
              onPress={() => {
                if (isSelf) router.push("/edit-profile");
                else router.push(`/message/${data.uuid}`);
              }}
            >
              {isSelf ? "Edit profile" : "Message"}
            </Button>

            {isSelf ? (
              <Button style={{ flex: 1, height: 32 }}>Share</Button>
            ) : (
              <FollowButton user_uuid={data.uuid} />
            )}
          </View>
        </View>
      </View>
      {data.bio ? (
        <Text style={{ marginTop: 24 }}>{data.bio}</Text>
      ) : isSelf && !data.bio ? (
        <Text style={{ marginTop: 24 }} color="muted">
          Add a biography in profile settings.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
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
});
