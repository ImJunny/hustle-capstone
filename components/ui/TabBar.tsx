import { useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import View from "../ui/View";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const themeColor = useThemeColor();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: themeColor.background,
        height: 56,
        borderColor: themeColor.border,
        borderTopWidth: 1,
      }}
    >
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];

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
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: "",
                size: 0,
              })}
          </PlatformPressable>
        );
      })}
    </View>
  );
}
