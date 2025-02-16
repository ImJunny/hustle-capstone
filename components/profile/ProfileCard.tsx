import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import { UserData } from "@/server/lib/user";
import ImagePlaceholder from "../ui/ImagePlaceholder";

export default function ProfileCard({ data }: { data: UserData }) {
  const hasBio = data.bio!.length > 0;

  return (
    <>
      <View style={styles.profileCard} color="background">
        <View style={styles.top}>
          <View>
            <ImagePlaceholder
              width={96}
              height={96}
              style={{ borderRadius: 999 }}
            />
            <Icon name="checkmark-circle" size="xl" style={styles.checkmark} />
          </View>

          <View style={styles.topInnerRight}>
            <Text color="foreground" size="xl" weight="semibold">
              {data?.first_name} {data?.last_name}
            </Text>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Icon name={"star"} color="foreground" />
              <Icon name={"star"} color="foreground" />
              <Icon name={"star"} color="foreground" />
              <Icon name={"star"} color="foreground" />
              <Icon name={"star-half"} color="foreground" />
              <Text weight="semibold" size="lg">
                (7 Reviews)
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button style={{ flex: 1, height: 32 }} type="variant">
                Edit profile
              </Button>
              <Button style={{ flex: 1, height: 32 }}>Follow</Button>
            </View>
          </View>
        </View>
        <Text color={hasBio ? "foreground" : "muted"} style={{ marginTop: 24 }}>
          {hasBio ? data!.bio : "Add a bio in settings."}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  top: {
    flexDirection: "row",
    gap: 20,
  },
  topInnerRight: {
    gap: 4,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    width: "100%",
  },
  checkmark: {
    position: "absolute",
    right: 4,
    bottom: 4,
  },
});
