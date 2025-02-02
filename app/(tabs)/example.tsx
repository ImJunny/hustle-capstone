import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { router } from "expo-router";
import Input from "@/components/ui/Input";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";

export default function ExampleScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Text demo */}
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
        <Input placeholder="This is an input..." type="default" />
        <Input placeholder="This is an input..." type="outline" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
});
