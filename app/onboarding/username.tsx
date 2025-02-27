import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { StyleSheet } from "react-native";

export default function Username() {
  return (
    <View style={[styles.page]} color="background">
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          Create a username
        </Text>
        <Text>
          This helps identify your account. All usernames are lowercase for easy
          identification.
        </Text>
      </View>
      <Input type="line" placeholder="Username" style={{ marginTop: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  button: {
    marginTop: "auto",
    borderRadius: 999,
    width: "100%",
  },
});
