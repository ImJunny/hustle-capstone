import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiSkeletonProps } from "moti/build/skeleton/types";
import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

type SkeletonProps = Omit<MotiSkeletonProps, "Gradient">;

export default function Skeleton({ children, ...props }: SkeletonProps) {
  const theme = useColorScheme();
  const colorMode = theme ?? "light";
  return (
    <MotiSkeleton colorMode={colorMode} {...props}>
      {children}
    </MotiSkeleton>
  );
}
