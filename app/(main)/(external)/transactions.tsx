import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { JobsCenterHeader, SimpleHeader } from "@/components/headers/Headers";
import { Href, Link } from "expo-router";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import Separator from "@/components/ui/Separator";
import { useFeedHeight } from "@/components/posts/Feed";

export default function TransactionsScreen() {
  const themeColor = useThemeColor();
  const contentHeight = useFeedHeight() + 57;
  const { user } = useAuthData();
  const { data, isLoading } = trpc.post.get_active_post_counts.useQuery({
    user_uuid: user?.id!,
  });

  const [scrollY] = useState(new Animated.Value(0)); // Track scroll position

  if (!user || isLoading || !data) {
    return (
      <>
        <JobsCenterHeader />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>Error encountered</Text>
          </View>
        )}
      </>
    );
  }

  // Parallax effect: Opacity and translation of the header based on scrollY
  const parallaxHeaderTranslate = scrollY.interpolate({
    inputRange: [0, 500], // Adjust to control when it disappears
    outputRange: [0, -100], // Moves up as the user scrolls
    extrapolate: "clamp", // Prevents the view from moving too far
  });

  // Fading effect of the header into themeColor.background as user scrolls
  const parallaxHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 80], // Adjust the range for opacity fade
    outputRange: [1, 0], // Header fades out
    extrapolate: "clamp",
  });

  const parallaxHeaderBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100], // When the scroll position reaches 200px
    outputRange: ["transparent", themeColor.background], // From transparent to theme background
    extrapolate: "clamp",
  });

  return (
    <>
      <SimpleHeader title="Transactions" />
      <Animated.ScrollView
        style={[styles.screen]}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y); // Update scroll position
        }}
        scrollEventThrottle={16} // Update scroll position more frequently
      >
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: parallaxHeaderTranslate }],
              opacity: parallaxHeaderOpacity,
              backgroundColor: parallaxHeaderBackgroundColor, // Apply animated background color
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("/transactions")}
          >
            <Text>
              Your{" "}
              <Text size="lg" style={{ fontFamily: "Lexend-bold" }}>
                Hustle
              </Text>{" "}
              Balance
            </Text>

            <Text weight="semibold" size="4xl" style={{ marginTop: 4 }}>
              $0.00
            </Text>
            <Separator color="foreground" style={{ marginTop: 4 }} />
          </TouchableOpacity>
        </Animated.View>
        <View
          style={[
            styles.categoryWrapper,
            {
              backgroundColor: themeColor.background,
              minHeight: contentHeight,
            },
          ]}
        >
          <View>
            <Text size="xl" weight="semibold">
              April 2025
            </Text>
            <Transaction type="income" title="Payout" amount={10} />
            <Transaction type="income" title="Hired" amount={40} />
            <Transaction type="expense" title="Something service" amount={50} />
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

type TransactionProps = {
  type: "income" | "expense";
  title: string;
  amount: number;
};

function Transaction({ type, title, amount }: TransactionProps) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 26,
          alignItems: "center",
        }}
      >
        <Icon
          name={type == "income" ? "wallet-outline" : "cash-outline"}
          size="xl"
        />
        <View style={{ marginLeft: 16, marginRight: "auto" }}>
          <Text style={{}} size="lg" weight="semibold">
            {title}
          </Text>
          <Text>•••• 3421</Text>
          <Text>4/18/25</Text>
        </View>
        <Text weight="bold" color={type === "income" ? "green" : "muted"}>
          {type === "income" ? "+" : "-"}${amount}
        </Text>
      </View>
      <Separator />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  categoryWrapper: {
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 1000,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    justifyContent: "center",
  },
});
