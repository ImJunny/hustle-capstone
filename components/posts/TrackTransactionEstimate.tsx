import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import View from "../ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TrackTransactionEstimate() {
  return (
    <View>
      <PriceRow title="Job rate" rate={55.5} />
      <PriceRow title="Service rate (8%)" rate={2.4} isFee />
      <PriceRow title="Total" rate={53.1} isTotal />
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
