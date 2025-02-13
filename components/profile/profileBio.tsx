import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Icon from "../ui/Icon";
import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import { TProfile } from "@/server/utils/example_data";

export default function profileBio({ data }: { data: TProfile }) {
  return (
    <View>
      <View style={styles.bottomContainer}>
        <View
          style={{ borderRadius: 999, width: 96, height: 96 }}
          color="muted"
        />
        <View style={styles.nameContainer}>
          <Text color="white" size="xl" weight="semibold">
            {data.user_name}
          </Text>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Icon name={"star"} color="white"></Icon>
            <Text color="white" weight="semibold">
              5/5 ( 7 Reviews)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    padding: 15,
  },
  nameContainer: { marginLeft: 20 },
});
