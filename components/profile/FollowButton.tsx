import Button from "../ui/Button";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { ViewProps } from "../ui/View";
import { useFollowedStore } from "@/hooks/useFollowedStore";

export default function FollowButton({
  user_uuid,
  style,
  invalidate = true,
}: {
  user_uuid: string;
  invalidate?: boolean;
} & ViewProps) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const { mutateAsync: followUser } = trpc.user.follow_user.useMutation();
  const { mutateAsync: unfollowUser } = trpc.user.unfollow_user.useMutation();

  const setFollowed = useFollowedStore((state) => state.setFollowed);
  const isFollowed =
    useFollowedStore((state) => state.isFollowed(user_uuid)) ?? true;

  const toggleFollow = async () => {
    const newIsFollowing = !isFollowed;
    setFollowed(user_uuid, newIsFollowing);

    const mutation = newIsFollowing ? followUser : unfollowUser;
    await mutation({ follower_uuid: user?.id!, following_uuid: user_uuid });

    try {
      await mutation({ follower_uuid: user?.id!, following_uuid: user_uuid });

      if (invalidate) {
        // utils.user.get_following.invalidate();
        // utils.user.get_user_data.invalidate();
      }
    } catch (error: any) {
      setFollowed(user_uuid, !newIsFollowing);
      Toast.show({
        text1: error.message,
        type: "error",
        visibilityTime: 1000,
        swipeable: false,
      });
    }
  };

  return (
    <Button
      onPress={toggleFollow}
      type={isFollowed ? "variant" : "primary"}
      style={[{ flex: 1, height: 32 }, style]}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  );
}
