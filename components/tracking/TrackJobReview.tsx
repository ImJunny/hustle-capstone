import View from "../ui/View";
import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import StarDisplay from "../ui/StarDisplay";
import { getGeneralDate } from "@/utils/helpers";
import Skeleton from "../ui/Skeleton";

export default function TrackJobReview({
  initiated_uuid,
  user_uuid,
}: {
  initiated_uuid: string;
  user_uuid: string;
}) {
  const { user } = useAuthData();
  const { data } = trpc.review.get_review.useQuery({
    user_uuid: user?.id as string,
    initiated_uuid,
  });
  const formattedDate = getGeneralDate(data?.created_at!);

  if (!data) return null;
  return (
    <View style={{ gap: 4, alignItems: "center" }}>
      <Text color="muted">{formattedDate}</Text>
      <StarDisplay rating={data.rating} size={32} />
      <Text size="sm">{data.review}</Text>
    </View>
  );
}
