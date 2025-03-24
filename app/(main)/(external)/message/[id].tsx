import React from "react";
import { useLocalSearchParams } from "expo-router";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import { SingleMessageFooter, SingleMessageHeader } from "@/components/headers/Headers";
import { Dimensions, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { exampleJobPosts, exampleMessages } from "@/server/utils/example-data";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { format, isToday, isThisYear } from "date-fns";
import TrackWorkPost from "@/components/posts/TrackWorkPost";

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  // Check if the date is today or in the current year using date-fns
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  if (isToday(date)) {
    return format(date, 'p'); // Only show time if today
  } else if (isThisYear(date)) {
    return format(date, 'MMM dd, p'); // Show date without year (e.g., "Mar 23, 2:30 PM")
  } else {
    return format(date, 'MMM dd, yyyy, p'); // Show date with year (e.g., "Mar 23, 2022, 2:30 PM")
  }
};

export default function MessageScreen() {
  const { id } = useLocalSearchParams();
  console.log("MessageScreen id", id);
  const msg = exampleMessages.find((msg) => msg.uuid === id);
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  if (!msg) {
    return (<>
    <Text>Message not found</Text>
    </>
    );
  }

  return (
      <>
        <SingleMessageHeader messenger={msg?.messenger ?? ""}/>
        {/* Job Detail Section - Only if is_job is true */}
      {msg.is_job && (
            <TrackWorkPost data = {exampleJobPosts[0]} style={{borderBottomColor: borderColor, borderBottomWidth: 1}}/>
      )}
        <View style={{ flex: 1 }} color="background">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.messageContainer}>
            {msg.messageHistory.map((history, index) => {
              const formattedTimestamp = formatTimestamp(history.timestamp);

              return (
                <View key={index} style={styles.messageWrapper}>
                  {/* Timestamp above the message */}
                  <Text style={styles.timestampText}>{formattedTimestamp}</Text>
                  <View style={history.sent ? [styles.sentMessage, {backgroundColor:themeColor.foreground}] 
                  : [styles.receivedMessage,{backgroundColor: themeColor["background-variant"]}]}>
                    <Text style={styles.messageText} color={history.sent ? "background" : "foreground"}>{history.message}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <SingleMessageFooter />
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 10,
    alignItems: 'center',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    maxWidth: 300,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    maxWidth: 300,
  },
  messageText: {
    fontSize: 14,
  },
  timestampText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5, // Space between the timestamp and message
    textAlign: 'center', // Center the timestamp
  },
  scrollContainer: {
    paddingBottom: 20, // To prevent the last item from getting hidden
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
    height: 84,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  jobDetailImage: {
    marginLeft: 12,
    borderRadius: 4,
  },
});
