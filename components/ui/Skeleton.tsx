import { MotiView } from "moti";
import { MotiSkeletonProps } from "moti/build/skeleton/types";
import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

type SkeletonProps = Omit<MotiSkeletonProps, "Gradient">;
export default function Skeleton({ children, ...props }: SkeletonProps) {
  const theme = useColorScheme() ?? "dark";

  return (
    <MotiView>
      <MotiSkeleton colorMode={theme} {...props}>
        {children}
      </MotiSkeleton>
    </MotiView>
  );
}
