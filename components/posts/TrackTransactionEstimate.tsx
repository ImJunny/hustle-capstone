import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionEstimate } from "@/server/actions/jobs-actions";
import { ServiceFee } from "@/constants/Rates";

export default function TrackTransactionEstimate({
  data,
  type = "accept",
}: {
  data?: TransactionEstimate;
  type?: "accept" | "approve";
}) {
  if (type === "accept")
    return (
      <View>
        <PriceRow title="Job rate" rate={data?.rate!} />
        <PriceRow
          title={`Service fee (${ServiceFee * 100}%)`}
          rate={data?.service_fee!}
          isFee
        />
        <PriceRow title="Total" rate={data?.total!} isTotal />
      </View>
    );

  return (
    <View>
      <PriceRow title="Total" rate={data?.rate!} isTotal />
    </View>
  );
}

function PriceRow({
  title,
  rate,
  isTotal,
  isFee,
}: {
  title: string;
  rate: number;
  isTotal?: boolean;
  isFee?: boolean;
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
        {isFee && "-"}${rate}
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
