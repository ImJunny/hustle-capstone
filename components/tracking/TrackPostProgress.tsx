import React from "react";
import Text from "@/components/ui/Text";
import View from "../ui/View";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import { useAuthData } from "@/contexts/AuthContext";

export type TrackPostProgressProps = {
  data: TrackPostType;
  self?: boolean;
};

export default function TrackPostProgress({
  data,
  self,
}: TrackPostProgressProps) {
  const { progress } = data;
  const { user } = useAuthData();
  const otherApproved =
    data.approved_worker_uuid != user?.id &&
    typeof data.approved_worker_uuid === "string";

  return (
    <View>
      {progress === "in progress" ? (
        <Text weight="semibold">
          In progress{`${self ? ", awaiting completion" : ""}`}
        </Text>
      ) : progress === "accepted" ? (
        <Text weight="semibold">
          Accepted
          {otherApproved ? ", another worker approved" : ""}
        </Text>
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
