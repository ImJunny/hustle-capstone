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
        <Text weight="semibold">
          In progress{`${self ? ", awaiting completion" : ""}`}
        </Text>
      ) : progress === "accepted" ? (
        <Text weight="semibold">Accepted</Text>
      ) : progress === "approved" ? (
        <Text weight="semibold">Approved{self ? " the worker" : ""}</Text>
      ) : progress === "complete" ? (
        <Text weight="semibold" color="yellow">
          Completed, {`${self ? "processing payment" : "processing payment"}`}
        </Text>
      ) : progress === "paid" ? (
        <Text color="green" weight="semibold">
          Payment {`${self ? "sent" : "received"}`}
        </Text>
      ) : progress === "cancelled" ? (
        <Text color="muted" weight="semibold">
          Cancelled
        </Text>
      ) : progress === "closed" ? (
        <Text color="muted" weight="semibold">
          Closed
        </Text>
      ) : (
        <Text weight="semibold">{progress}</Text>
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
