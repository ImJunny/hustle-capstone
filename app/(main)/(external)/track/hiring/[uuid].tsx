import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import {
  BackHeader,
  DetailsHeader,
  SimpleHeader,
} from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Badge from "@/components/ui/Badge";
import { Dimensions, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import {
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example-data";
import { useThemeColor } from "@/hooks/useThemeColor";
import TrackingProgressBar from "@/components/posts/TrackProgressBar";
import Separator from "@/components/ui/Separator";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";

export default function TrackWorkingDetailsScreen() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const { width } = Dimensions.get("window");

  const { uuid } = useLocalSearchParams();

  const progressDescription =
    "You have accepted this job. This does not guarantee you as the worker. Please wait for the employer to approve you for the job.";
  return (
    <>
      <SimpleHeader title="Tracking details" />
      <ScrollView color="background" style={styles.container}>
        <View style={styles.progressSection}>
          <ImagePlaceholder width={100} height={100} />
          <View style={styles.textHeader}>
            <Text size="xl" weight="semibold">
              Lawn mowing needed
            </Text>
            <Text>Due February 20</Text>
          </View>
          <TrackingProgressBar progress="accepted" />
          <Text color="muted">{progressDescription}</Text>
          <Button>Unaccept</Button>
        </View>

        <Separator />

        <View style={styles.transactionSection}>
          <Text size="xl" weight="semibold">
            Transaction estimate
          </Text>
          <TrackTransactionEstimate />
        </View>

        <Separator />

        <View style={styles.locationSection}>
          <View>
            <Text size="xl" weight="semibold">
              Job location
            </Text>
            <Text color="muted">
              {`308 Negra Arroyo Lane\nAlbuquerque, New Mexico\n87104`}
            </Text>
          </View>
        </View>

        <Separator />

        <View style={styles.employerSection}>
          <Text size="xl" weight="semibold">
            Worker
          </Text>
          <View style={styles.employerRow}>
            <ImagePlaceholder
              width={40}
              height={40}
              style={{ borderRadius: 999 }}
            />
            <View style={{ gap: 4 }}>
              <Text weight="semibold">@dwadwa</Text>
              <View style={styles.employerStarsRow}>
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Text size="sm" style={{ marginLeft: 4 }}>
                  4
                </Text>
              </View>
            </View>

            <Button type="variant" style={styles.messageButton}>
              <Icon name="chatbubble-ellipses-outline" size="xl" flippedX />
              Message
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 0 },
  textHeader: {
    alignItems: "center",
    gap: 8,
  },
  progressSection: {
    alignItems: "center",
    gap: 32,
    paddingVertical: 52,
  },
  transactionSection: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 52,
  },
  locationSection: {
    flexDirection: "row",
    paddingVertical: 52,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  employerSection: {
    paddingVertical: 52,
    justifyContent: "space-between",
    gap: 12,
  },
  employerRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  employerStarsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  messageButton: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 12,
  },
});
