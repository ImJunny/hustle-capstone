import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import { Post as TPost } from "@/server/actions/post-actions";
import Post from "../posts/Post";

export default function ProfileSection({
  title,
  type,
  posts,
}: {
  title: string;
  type: "work" | "hire";
  posts: TPost[];
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

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
          data={post}
          type={type}
          style={{
            borderColor,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingTop: 16,
  },
});
