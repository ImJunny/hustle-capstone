import { ActivityIndicator } from "react-native";
import View, { ViewProps } from "./View";
import { BackHeader } from "../headers/Headers";
import { TColors } from "@/constants/Colors";

export default function LoadingView({
  backHeader,
  color,
  style,
}: {
  backHeader?: boolean;
  color?: TColors;
} & ViewProps) {
  return (
    <>
      {backHeader && <BackHeader />}
      <View
        style={[{ flex: 1, justifyContent: "center" }, style]}
        color={color}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    </>
  );
}
