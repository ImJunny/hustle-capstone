import { ActivityIndicator } from "react-native";
import View from "./View";
import { BackHeader } from "../headers/Headers";

export default function LoadingScreen({
  backHeader,
}: {
  backHeader?: boolean;
}) {
  return (
    <>
      {backHeader && <BackHeader />}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </>
  );
}
