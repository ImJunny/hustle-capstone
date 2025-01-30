import { Image, StyleSheet, useColorScheme } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Text from "@/components/ui/Text";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import View from "@/components/ui/View";
import IconButton from "@/components/ui/IconButton";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const borderColor = useThemeColor("border");

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
        <Text size="2xl" style={{ fontFamily: "Lexend-bold" }}>
          Hustle
        </Text>
        <Text size="xl" weight="semibold">
          You can mix different sizes and weights to text.
        </Text>
        <Text>This page is a demonstration of custom made components</Text>
        <Badge>
          <Icon name="star" size="xs" />
          <Text size="sm" weight="semibold">
            4.5/5
          </Text>
        </Badge>
        <Button color="black">
          <Text weight="semibold" color="white">
            Click me!
          </Text>
        </Button>
        <Icon name="home" />
        <IconButton
          name="home"
          onPress={() => router.push("/(tabs)/explore")}
        />
        <View
          style={{
            height: 50,
            borderWidth: 2,
            borderRadius: 8,
            borderColor: borderColor,
          }}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
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
