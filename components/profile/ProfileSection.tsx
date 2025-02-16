import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "../ui/Text";
import View from "../ui/View";
import { StyleSheet } from "react-native";
import { TPost } from "@/server/utils/example_data";
import Post from "../posts/Post";

export default function ProfileSection({
  title,
  posts,
}: {
  title: string;
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
      {posts.map((data, i) => (
        <Post
          key={i}
          data={data}
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
