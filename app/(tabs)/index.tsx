import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, FlatList, Dimensions } from "react-native";
import Feed from "@/components/ui/Feed";
import ScrollView from "@/components/ui/ScrollView";

const { height } = Dimensions.get("window");
const contentHeight = height * 0.8; // 80% of the screen height

const serverData = {
  data: [
    {
      uuid: "udha838ru23r",
      title: "Lawn Mowing Needed",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
      rate: 5,
      tags: ["$60", "yardwork", "within 10 miles"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
    {
      uuid: "udha838ru23s",
      title: "Lawn Mowing",
      description: "Lorem Ipsum...",
      rate: 3,
      tags: ["blank", "blank2", "blank3"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
    {
      uuid: "udha838ru23t",
      title: "Lawn Mowing",
      description: "Lorem Ipsum...",
      rate: 4,
      tags: ["blank", "blank2", "blank3"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
  ],
};

export default function HomeScreen() {
  return (
    <FlatList
      data={serverData.data}
      renderItem={({ item }) => <Feed postData={item} />}
      keyExtractor={(item) => item.uuid}
      pagingEnabled
      snapToInterval={contentHeight}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: contentHeight,
        offset: contentHeight * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
