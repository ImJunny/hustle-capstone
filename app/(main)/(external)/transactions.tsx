import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Icon from "@/components/ui/Icon";
import { SimpleHeader } from "@/components/headers/Headers";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Separator from "@/components/ui/Separator";
import { useFeedHeight } from "@/components/posts/Feed";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { TransactionType } from "@/server/actions/payment-actions";
import { RefreshControl } from "react-native-gesture-handler";

export default function TransactionsScreen() {
  const themeColor = useThemeColor();
  const contentHeight = useFeedHeight() + 57;
  const { user } = useAuthData();
  const { data, isLoading, error, refetch } =
    trpc.payment.get_transaction_data.useQuery({
      user_uuid: user!.id,
    });

  const balance = data?.balance.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  let pendingBalance = 0;
  data?.transactions.forEach((transaction) => {
    if (transaction.status === "pending" && transaction.type === "income")
      pendingBalance += transaction.amount;
  });
  const groupedTransactions = groupTransactionsByMonth(
    data?.transactions as any
  );
  const pending = pendingBalance.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [scrollY] = useState(new Animated.Value(0)); // Track scroll position

  if (!data || isLoading) {
    return (
      <LoadingScreen
        loads={[isLoading]}
        errors={[error]}
        data={data}
        header={<SimpleHeader title="Transactions" />}
      />
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
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);
  return (
    <>
      <SimpleHeader title="Transactions" />
      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
          />
        }
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
              {balance}
            </Text>
            <Separator
              color="foreground"
              style={{ marginTop: 4, marginBottom: 4 }}
            />
            {pendingBalance > 0 && (
              <Text color="muted" size="sm">
                ({pending} pending)
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        {data.transactions.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <Text>No transactions yet</Text>
          </View>
        ) : (
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
              {Object.entries(groupedTransactions).map(
                ([month, transactions]) => (
                  <View key={month} style={{ marginBottom: 24 }}>
                    <Text
                      size="xl"
                      weight="semibold"
                      style={{ marginBottom: 8 }}
                    >
                      {month}
                    </Text>
                    <Separator />
                    {transactions.map((transaction) => (
                      <Transaction
                        key={transaction.created_at}
                        type={transaction.type}
                        title={transaction.title}
                        status={transaction.status}
                        amount={transaction.amount}
                        date={transaction.created_at}
                      />
                    ))}
                  </View>
                )
              )}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </>
  );
}

type TransactionProps = {
  type: "income" | "expense";
  title: string;
  amount: number;
  status: string;
  date: string | Date;
};

function Transaction({ type, title, status, amount, date }: TransactionProps) {
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
        <View style={{ marginLeft: 20, marginRight: "auto" }}>
          <Text
            style={{
              textTransform: "capitalize",
            }}
            size="lg"
            weight="semibold"
          >
            {title}
          </Text>
          <Text>{formattedDate}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            weight="bold"
            color={
              type === "income" && status === "succeeded"
                ? "green"
                : status === "pending"
                ? "muted"
                : "foreground"
            }
          >
            {type === "income" ? "+" : "-"}
            {formattedAmount}
          </Text>

          {status == "pending" && (
            <Text color="muted" size="sm">
              ({status})
            </Text>
          )}
        </View>
      </View>
      <Separator />
    </View>
  );
}

function groupTransactionsByMonth(transactions: TransactionType[]) {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.created_at);
    const key = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }); // e.g. "April 2025"

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(transaction);
    return groups;
  }, {} as Record<string, TransactionType[]>);
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
