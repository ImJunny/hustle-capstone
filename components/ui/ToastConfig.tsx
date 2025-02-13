import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastConfig,
  ToastProps,
} from "react-native-toast-message";
import View from "./View";
import Text from "./Text";
import { JSX } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const InfoToast = ({ text1, props }: any) => {
  const themeColor = useThemeColor(); // Call the hook here

  return (
    <View
      style={{
        backgroundColor: themeColor["background-variant"],
        justifyContent: "center",
        minWidth: 200,
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 999,
      }}
    >
      <Text style={{ textAlign: "center" }}>{text1}</Text>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),

  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  info: (props) => <InfoToast {...props} />,
};
