import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionEstimate } from "@/server/actions/jobs-actions";
import { ServiceFee } from "@/constants/Rates";

export default function TrackTransactionEstimate({
  data,
}: {
  data?: TransactionEstimate;
}) {
  return (
    <View>
      <PriceRow title="Job rate" rate={data?.rate ?? 55.5} />
      <PriceRow
        title={`Service fee (${ServiceFee * 100}%)`}
        rate={data?.service_fee ?? 2.4}
        isFee
      />
      <PriceRow title="Total" rate={data?.total ?? 53.1} isTotal />
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
