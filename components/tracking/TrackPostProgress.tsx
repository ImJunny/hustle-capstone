import React from "react";
import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "../ui/View";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";

export type TrackPostProgressProps = {
  data: TrackPostType;
  self?: boolean;
};

export default function TrackPostProgress({
  data,
  self,
}: TrackPostProgressProps) {
  const { progress } = data;
  return (
    <View>
      {progress === "in progress" ? (
        <Text weight="semibold" size="lg">
          In progress{`${self ? ", awaiting completion" : ""}`}
        </Text>
      ) : progress === "accepted" ? (
        <Text weight="semibold" size="lg">
          Accepted
        </Text>
      ) : progress === "approved" ? (
        <Text weight="semibold" size="lg">
          Approved{self ? " the worker" : ""}
        </Text>
      ) : progress === "complete" ? (
        <Text weight="semibold" color="yellow" size="lg">
          Completed, {`${self ? "processing payment" : "processing payment"}`}
        </Text>
      ) : progress === "paid" ? (
        <Text color="green" weight="semibold" size="lg">
          Payment {`${self ? "sent" : "received"}`}
        </Text>
      ) : progress === "cancelled" ? (
        <Text color="muted" weight="semibold" size="lg">
          Cancelled
        </Text>
      ) : progress === "closed" ? (
        <Text color="muted" weight="semibold" size="lg">
          Closed
        </Text>
      ) : (
        <Text weight="semibold" size="lg">
          {progress}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 16,
  },
  entryContent: {
    flex: 1,
    alignSelf: "stretch",
  },
});
