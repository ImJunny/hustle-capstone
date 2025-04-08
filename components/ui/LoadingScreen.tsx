import { TRPCError } from "@trpc/server";
import LoadingView from "./LoadingView";
import Text from "./Text";
import View from "./View";
import { TRPCClientErrorLike } from "@trpc/react-query";

type LoadingScreenProps = {
  loads: boolean[] | boolean;
  data?: NonNullable<any>;
  header?: React.ReactNode;
  errors?: any;
};

export default function LoadingScreen({
  loads,
  data,
  header,
  errors,
}: LoadingScreenProps) {
  if ((Array.isArray(loads) && loads.some((isLoading) => isLoading)) || !data) {
    return (
      <>
        {header}
        <LoadingView />
      </>
    );
  } else if (errors.length > 0) {
    return (
      <>
        {header}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>A problem occurred</Text>
        </View>
      </>
    );
  } else {
    return null;
  }
}
