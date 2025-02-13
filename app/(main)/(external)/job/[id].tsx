import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useLocalSearchParams, useSegments } from "expo-router";
import { BackHeader, DetailsHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Badge from "@/components/ui/Badge";
import { StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";

export default function JobPostScreen() {
  const { id, type } = useLocalSearchParams();
  return (
    <>
      <DetailsHeader />
      <ScrollView>
        <ImagePlaceholder width={800} height={320} />
        <Text>Details for job with id: {id}</Text>
        <Text>Details for job with type: {id}</Text>
        <View
          style={{
            padding: 15,
            borderBottomColor: "grey",
            borderBottomWidth: 2,
          }}
        >
          <Text color="white" size="2xl" weight="semibold">
            Title
          </Text>
          <View style={styles.badgeRow}>
            <Badge>
              <Text
                style={{ textTransform: "uppercase" }}
                size="sm"
                weight="semibold"
              >
                Type
              </Text>
            </Badge>
            <Badge>(distance)</Badge>
          </View>
          <Text numberOfLines={3} ellipsizeMode="tail" color="muted-dark">
            (description)
          </Text>
          <View style={{ flexDirection: "row", marginVertical: 15 }}>
            <Text color="muted-dark">Posted time_ago</Text>
            <Text style={{ marginLeft: "auto" }} color="muted-dark">
              Due (due_date)
            </Text>
          </View>
          <View>
            <Button style={styles.pageButton}>
              <Text color="black" weight="semibold">
                Accept Job
              </Text>
            </Button>
          </View>
        </View>
        <View
          style={{
            padding: 15,
            borderBottomColor: "grey",
            borderBottomWidth: 2,
          }}
        >
          <View style={{ marginTop: 15, marginBottom: 10 }}>
            <Text color="white" size="md" weight="semibold">
              Service Rating
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View>
              <Text color="white" size="4xl" weight="semibold">
                (Rating)/5
              </Text>
              <View style={{ flexDirection: "row", gap: 2, marginVertical: 5 }}>
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <View style={{ marginHorizontal: 5 }}>
                  <Text>(Number) Reviews</Text>
                </View>
              </View>
            </View>
            <View style={styles.reviewButton}>
              <IconButton name="chevron-forward" size="2xl" />
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 15,
            borderBottomColor: "grey",
            borderBottomWidth: 2,
          }}
        >
          <View style={{ marginTop: 15 }}>
            <Text color="white" size="md" weight="semibold">
              About the Employer
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <View
              style={{ borderRadius: 999, width: 40, height: 40 }}
              color="muted"
            />
            <View style={styles.nameContainer}>
              <Text color="white" weight="semibold">
                @(user_name)
              </Text>
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Icon name={"star"} color="white"></Icon>
                <Text color="white" weight="semibold">
                  (rating)/5
                </Text>
              </View>
            </View>
            <Button style={styles.viewButton}>
              <Text color="white" weight="semibold">
                Message
              </Text>
            </Button>
          </View>
          <View style={{ marginVertical: 15, marginBottom: 15 }}>
            <Text numberOfLines={3} ellipsizeMode="tail" color="muted-dark">
              (employer_description)
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  pageButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20 },
  viewButton: {
    marginLeft: "auto",
    backgroundColor: "grey",
    paddingHorizontal: 30,
  },
  reviewButton: {
    marginLeft: "auto",
    marginTop: "auto",
  },
});
