import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import Post from "../posts/Post";
import { trpc } from "@/server/lib/trpc-client";

export default function ProfileSection({
  title,
  type,
  userUUID,
}: {
  title: string;
  type: "work" | "hire";
  userUUID: string;
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  const { data: posts, isLoading } = trpc.post.get_user_post_uuids.useQuery({
    uuid: userUUID,
    type: type,
  });
  if (isLoading) return;
  else if (!posts || posts.length === 0) return;
  return (
    <View style={[styles.sectionContainer, { borderColor }]} color="background">
      <Text
        weight="semibold"
        size="xl"
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        {title} • {posts.length}
      </Text>
      {posts.map((post, i) => (
        <Post
          key={i}
          uuid={post.uuid}
          type={type}
          style={{
            borderTopWidth: 1,
            borderColor,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: 8,
  },
});
