import { useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "./Text";
import View from "./View";
import { useSegments } from "expo-router";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { LayoutAnimation } from "react-native";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const themeColor = useThemeColor();

  // const segments = useSegments();
  // const hiddenBarScreens = ["chat", "job-post", "profile"];
  // const segmentSet = new Set(segments);
  // const hide = hiddenBarScreens.some((screen: any) => segmentSet.has(screen));

  // useEffect(() => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // }, [segments]);

  // if (hide) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: themeColor.background,
        height: 64,
        borderColor: themeColor.border,
        borderTopWidth: 2,
      }}
    >
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={`pressable-${index}`}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: "",
                size: 0,
              })}
            <Text
              size="xs"
              weight={isFocused ? "bold" : "normal"}
              color={isFocused ? "foreground" : "muted"}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
