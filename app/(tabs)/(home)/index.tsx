import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Text from "@/components/ui/Text";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import View from "@/components/ui/View";
import IconButton from "@/components/ui/IconButton";
import { router } from "expo-router";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Input from "@/components/ui/Input";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<ImagePlaceholder style={{ position: "absolute" }} />}
    >
      {/* Text demo */}
      <View style={styles.titleContainer}>
        <Text size="2xl">Largest font size. (2xl)</Text>
        <Text size="xl">This is XL. (xl)</Text>
        <Text size="lg">
          This page is a demonstration of custom made components. (lg)
        </Text>
        <Text>Text is this size by default. (md)</Text>
        <Text weight="bold">
          Text weight options are normal (by default), semibold, and bold. This
          is bold.
        </Text>
        <Text size="sm">And it can get smaller. (sm)</Text>

        <Badge>Tag</Badge>
        <Badge style={{ gap: 4 }}>
          <Icon name="star" />
          4.5/5
        </Badge>

        {/* Button demo */}

        <Button
          type="primary"
          onPress={() => alert("Button pressed!")}
          style={{ gap: 8 }}
        >
          <Icon name="person" size="lg" color="background" />
          Click me!
        </Button>
        <Button type="primary">Primary</Button>
        <Button type="secondary">Secondary</Button>
        <Button type="outline">Outline</Button>
        <Button type="variant" isFullWidth>
          Variant with isFullWidth
        </Button>

        {/* Icon & IconButton demo */}
        <Icon name="home" size="sm" />
        <Icon name="home" />
        <Icon name="home" size="lg" />
        <IconButton
          name="chevron-forward"
          size="xl"
          onPress={() => router.push("/profile")}
        />

        {/* Input demo */}
        <Input placeholder="This is an input..." />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
  },
});
