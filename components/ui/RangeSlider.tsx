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
  step?: number;
};

export default function RangeSlider({
  minConstant,
  maxConstant,
  setMin,
  setMax,
  min,
  max,
  step = 1,
}: RangeSliderProps) {
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
    },
    [setMin, setMax]
  );

  return (
    <RNRangeSlider
      min={minConstant}
      max={maxConstant}
      step={step}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      onValueChanged={handleValueChange}
      low={min}
      high={max}
    />
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 30,
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    width: 100,
  },
  railSelected: {
    height: 4,
    borderRadius: 2,
  },
  label: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 28,
  },
});
