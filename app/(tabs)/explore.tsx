import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import ScrollView from "@/components/ui/ScrollView";
import CategoryComponent from "@/components/explore/CategoryCard";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import Separator from "@/components/ui/Separator";
import CategoryCard from "@/components/explore/CategoryCard";
import { StyleSheet } from "react-native";

const categories = [
  { id: 1, title: "Technology" },
  { id: 2, title: "Health" },
  { id: 3, title: "Finance" },
  { id: 4, title: "Education" },
];
export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} color="background">
      <View>
        <Text size="xl" weight="bold" color="white" style={{ marginBottom: 8 }}>
          Top Categories
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {categories.map((category, i) => (
            <CategoryCard key={category.id} title={category.title} style={{}} />
          ))}
        </ScrollView>
        <Button onPress={() => router.push("/job-post")}>
          ~Go to a job post~
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
