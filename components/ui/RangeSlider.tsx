import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import View from "../ui/View";
import { default as RNRangeSlider } from "rn-range-slider";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "./Text";

type RangeSliderProps = {
  minConstant: number;
  maxConstant: number;
  min: number;
  max: number;
  setMin: Dispatch<SetStateAction<number>>;
  setMax: Dispatch<SetStateAction<number>>;
  setMinText: Dispatch<SetStateAction<string>>;
  setMaxText: Dispatch<SetStateAction<string>>;
};

function RangeSlider(
  this: any,
  {
    minConstant,
    maxConstant,
    setMin,
    setMax,
    min,
    max,
    setMinText,
    setMaxText,
  }: RangeSliderProps
) {
  const themeColor = useThemeColor();
  const renderThumb = useCallback(
    () => <View style={styles.thumb} color="foreground" />,
    []
  );
  const renderRail = useCallback(
    () => (
      <View
        style={[
          styles.rail,
          { backgroundColor: themeColor["background-variant"] },
        ]}
      />
    ),
    []
  );
  const renderRailSelected = useCallback(
    () => (
      <View
        style={[
          styles.railSelected,
          { backgroundColor: themeColor.foreground },
        ]}
      />
    ),
    []
  );

  const handleValueChange = useCallback(
    (newMin: number, newMax: number) => {
      setMin(newMin);
      setMax(newMax);
      setMinText(String(newMin));
      setMaxText(`$${newMax}${newMax == maxConstant ? "+" : ""}`);
    },
    [setMin, setMax]
  );

  return (
    <RNRangeSlider
      min={minConstant}
      max={maxConstant}
      step={1}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      onValueChanged={handleValueChange}
      low={min}
      high={max}
    />
  );
}

export default memo(RangeSlider);

const styles = StyleSheet.create({
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  rail: {
    flex: 1,
    height: 5,
    borderRadius: 2,
    width: 100,
  },
  railSelected: {
    height: 5,
    borderRadius: 2,
  },
  label: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 28,
  },
});
