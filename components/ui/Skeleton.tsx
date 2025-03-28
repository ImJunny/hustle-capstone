import { MotiView } from "moti";
import { MotiSkeletonProps } from "moti/build/skeleton/types";
import { Skeleton as MotiSkeleton } from "moti/skeleton";

type SkeletonProps = Omit<MotiSkeletonProps, "Gradient">;
export default function Skeleton({ children, ...props }: SkeletonProps) {
  return (
    <MotiView>
      <MotiSkeleton {...props}>{children}</MotiSkeleton>
    </MotiView>
  );
}
