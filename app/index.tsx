import { Redirect } from "expo-router";
export default function RootLayout() {
  return <Redirect href="/signin" />;
}

// import View from "@/components/ui/View";
// import { Dimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function RootLayout() {
//   const { width, height } = Dimensions.get("window");
//   const { bottom } = useSafeAreaInsets();
//   console.log(bottom);
//   return (
//     <View
//       style={{
//         height,
//         backgroundColor: "red",
//         width,
//         borderBottomWidth: 22,
//         borderColor: "blue",
//       }}
//     ></View>
//   );
// }
