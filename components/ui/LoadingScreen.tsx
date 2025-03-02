import { ActivityIndicator } from "react-native";
import View from "./View";
import { BackHeader } from "../headers/Headers";
import { TColors } from "@/constants/Colors";

export default function LoadingScreen({
  backHeader,
  color,
}: {
  backHeader?: boolean;
  color?: TColors;
}) {
  return (
    <>
      {backHeader && <BackHeader />}
      <View style={{ flex: 1, justifyContent: "center" }} color={color}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </>
  );
}
