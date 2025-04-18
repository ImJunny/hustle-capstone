import { StyleSheet } from "react-native";
import Icon from "./Icon";
import View from "./View";
import Text from "./Text";
import { TIconSizes } from "@/constants/Sizes";

type StarDisplayProps = {
  rating: number;
  count?: number;
  size?: number | TIconSizes;
};
export default function StarDisplay({
  rating,
  count,
  size = "md",
}: StarDisplayProps) {
  const whole = Math.floor(rating);
  const half = rating - whole >= 0.5;
  const empty = 5 - whole - (half ? 1 : 0);

  const renderWhole = [];
  for (let i = 0; i < whole; i++) {
    renderWhole.push(<Icon name="star" key={i} size={size} />);
  }
  const renderHalf = half ? (
    <Icon name="star-half-outline" size={size} />
  ) : null;
  const renderEmpty = [];
  for (let i = 0; i < empty; i++) {
    renderEmpty.push(<Icon name="star-outline" key={i} size={size} />);
  }
  return (
    <View style={styles.container}>
      {renderWhole}
      {renderHalf}
      {renderEmpty}
      {count && (
        <Text size="sm" style={styles.text}>
          {count}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  text: {
    marginLeft: 4,
  },
});
