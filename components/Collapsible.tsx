import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Icon name="chevron-forward" />

        <Text>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
