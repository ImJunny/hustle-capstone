import { TRPCError } from "@trpc/server";
import LoadingView from "./LoadingView";
import Text from "./Text";
import View from "./View";
import { TRPCClientErrorLike } from "@trpc/react-query";
import { TRPCQueryOptions } from "@trpc/react-query/dist/shared";
import { QueryObserverResult } from "@tanstack/react-query";
import ScrollView from "./ScrollView";

type LoadingScreenProps = {
  loads: boolean[] | boolean;
  data?: NonNullable<any>;
  header?: React.ReactNode;
  errors?: any;
  refetch?: QueryObserverResult["refetch"];
};

export default function LoadingScreen({
  loads,
  data,
  header,
  errors,
  refetch,
}: LoadingScreenProps) {
  if ((Array.isArray(loads) && loads.some((isLoading) => isLoading)) || !data) {
    return (
      <>
        {header}
        <LoadingView />
      </>
    );
  } else if (errors && errors.length > 0) {
    return (
      <>
        {header}
        <ScrollView
          refetch={refetch ? refetch : undefined}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>A problem occurred</Text>
        </ScrollView>
      </>
    );
  } else {
    return null;
  }
}
