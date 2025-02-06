import { StyleSheet, FlatList, Dimensions, StatusBar } from "react-native";
import Feed from "@/components/ui/Feed";
import React, { useEffect, useRef } from "react";
import { ExampleHeader } from "@/components/headers/Headers";

export type TServerData = {
  data: {
    uuid: string;
    title: string;
    description: string;
    rate: number;
    rating: number;
    tags: string[];
    location_type: string;
    location_address: string;
    date: string;
    name: string;
  }[];
};
const serverData: TServerData = {
  data: [
    {
      uuid: "udha85438ru23r",
      title: "Lawn Mowing Needed",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
      rate: 5,
      rating: 5,
      tags: ["$60", "yardwork", "within 10 miles"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
    {
      uuid: "udha83138ru23s",
      title: "Lawn Mowing",
      description: "Lorem Ipsum...",
      rate: 3,
      rating: 4.5,
      tags: ["blank", "blank2", "blank3"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
    {
      uuid: "udha838432ru23t",
      title: "Lawn Mowing",
      description: "Lorem Ipsum...",
      rate: 4,
      rating: 3.5,
      tags: ["blank", "blank2", "blank3"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
    {
      uuid: "udha832348ru23t",
      title: "Lawn Mowing",
      description: "Lorem Ipsum...",
      rate: 6,
      rating: 5,
      tags: ["blank", "blank2", "blank3"],
      location_type: "local",
      location_address: "123 St",
      date: "January 20th",
      name: "Kevin Li",
    },
  ],
};

export default function HomeScreen() {
  const { width, height: totalHeight } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const subtractedHeight = 56 + 56 + statusBarHeight;
  const newHeight = totalHeight - subtractedHeight;

  return (
    <>
      <ExampleHeader />
      <FlatList
        data={serverData.data}
        renderItem={({ item }) => <Feed key={item.uuid} postData={item} />}
        keyExtractor={(item) => item.uuid}
        pagingEnabled
        snapToInterval={newHeight}
        snapToAlignment="end"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: newHeight,
          offset: newHeight * index,
          index,
        })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
