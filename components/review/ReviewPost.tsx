import { ReviewData } from "@/server/actions/review-actions";
import Text from "../ui/Text";
import View from "../ui/View";
import AvatarImage from "../ui/AvatarImage";
import { formatDistanceToNow } from "date-fns";
import StarDisplay from "../ui/StarDisplay";
import Separator from "../ui/Separator";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ReviewPost({ data }: { data: ReviewData }) {
  const formattedTimeAgo = formatDistanceToNow(data.created_at, {
    addSuffix: true,
  });

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "row",
        gap: 20,
        borderBottomWidth: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push(`/profile/${data.reviewer_uuid}`)}
      >
        <AvatarImage url={data.avatar_url} size={50} />
      </TouchableOpacity>

      <View
        style={{
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text weight="semibold" size="lg">
              @{data.reviewer_username}
            </Text>
            <StarDisplay rating={data.rating} />
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/post/${data.post_uuid}` as any)}
          >
            <Image
              source={{ uri: data.post_image_url }}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 4 }}>{data.review}</Text>
        <Text color="muted" size="sm" style={{ marginTop: 4 }}>
          {formattedTimeAgo}
        </Text>
      </View>
    </View>
  );
}
