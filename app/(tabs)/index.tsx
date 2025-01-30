import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Text from "@/components/ui/Text";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import View from "@/components/ui/View";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text size="2xl" style={{ fontFamily: "Lexend_bold" }}>
          Hustle
        </Text>
        <Text size="lg">Large text is this.</Text>
        <Text size="md">Hustle</Text>
        <Badge>
          <Icon name="star" size="xs" />
          <Text size="sm" weight="semibold">
            4.5/5
          </Text>
        </Badge>
        <Button color="black">
          <Text weight="semibold" color="background">
            Home
          </Text>
        </Button>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
