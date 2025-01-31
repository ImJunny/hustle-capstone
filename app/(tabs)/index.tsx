import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Text from "@/components/ui/Text";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import View from "@/components/ui/View";
import IconButton from "@/components/ui/IconButton";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export default function HomeScreen() {
  const themeColor = useThemeColor()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <ImagePlaceholder style={{position:"absolute"}}/>
      }
    >
      <View style={styles.titleContainer}>
        <Text size="2xl" style={{ fontFamily: "Lexend-bold" }}>
          Hustle
        </Text>
        <Text size="xl" weight="semibold">
          You can mix different sizes and weights to text.
        </Text>
        <Text size="lg">This page is a demonstration of custom made components.</Text>
        <Text>This text is by default "md" size.</Text>
        <Text size="sm">And it can get smaller.</Text>

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
            borderColor: themeColor.border,
          }}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
  }
});
