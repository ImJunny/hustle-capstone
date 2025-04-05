import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionEstimate } from "@/server/actions/jobs-actions";

export default function TrackTransactionEstimate({
  data,
  type = "accept",
  totalOnly = false,
}: {
  data: TransactionEstimate;
  type?: "accept" | "approve";
  totalOnly?: boolean;
}) {
  if (totalOnly) {
    if (type === "accept") {
      return (
        <PriceRow title="Total" value={data.total - data.service_fee} isTotal />
      );
    } else {
      return <PriceRow title="Total" value={data.rate} isTotal />;
    }
  }

  return (
    <View style={{ width: "100%" }}>
      <PriceRow title="Total" value={data.rate} />
      <PriceRow
        title="Service fee"
        value={data.service_fee}
        isDeduction={true}
      />
      <PriceRow title="You receive" value={data.total} isTotal />
    </View>
  );
}

function PriceRow({
  title,
  value,

  isDeduction,
  isTotal,
}: {
  title: string;
  value: number;
  isDeduction?: boolean;
  isTotal?: boolean;
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.transactionEntry, { borderColor }]}>
      <Text
        weight={isTotal ? "semibold" : "normal"}
        color={isTotal ? "foreground" : "muted"}
      >
        {title}
      </Text>
      <Text
        weight={isTotal ? "semibold" : "normal"}
        color={isTotal ? "foreground" : "muted"}
      >
        {isDeduction && "-"}${value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionEntry: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
});
