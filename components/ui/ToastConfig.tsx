import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
  ToastProps,
} from "react-native-toast-message";
import View from "./View";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Platform } from "react-native";

const GenericToast = ({ ...props }: ToastConfigParams<any>) => {
  const themeColor = useThemeColor(); // Call the hook here
  const marginTop = Platform.OS === "ios" ? 20 : 0;

  return (
    <View
      style={{
        marginTop,
        backgroundColor:
          props.type === "info"
            ? "#444444"
            : props.type === "error"
            ? "#d93d3d"
            : "#479147",
        justifyContent: "center",
        height: 36,
        paddingHorizontal: 20,
        borderRadius: 999,
      }}
    >
      <Text style={{ textAlign: "center" }} color="white">
        {props.text1}
      </Text>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  info: (props) => <GenericToast {...props} />,
  success: (props) => <GenericToast {...props} />,
  error: (props) => <GenericToast {...props} />,
};
