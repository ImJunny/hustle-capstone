import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { ViewProps } from "../ui/View";
import { useFollowedStore } from "@/hooks/useFollowedStore";

export default function FollowButton({
  following = true,
  user_uuid,
  style,
  invalidate = true,
}: {
  following: boolean;
  user_uuid: string;
  invalidate?: boolean;
} & ViewProps) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const { mutate: followUser } = trpc.user.follow_user.useMutation();
  const { mutate: unfollowUser } = trpc.user.unfollow_user.useMutation();

  const follow = useFollowedStore((state) => state.follow);
  const unfollow = useFollowedStore((state) => state.unfollow);
  const [localFollowed, setLocalFollowed] = useState(following);
  const isFollowed = useFollowedStore((state) => state.isFollowed(user_uuid));

  useEffect(() => {
    setLocalFollowed(following);
  }, [following]);

  const toggleFollow = () => {
    const newIsFollowing = !isFollowed;
    newIsFollowing ? setLocalFollowed(true) : setLocalFollowed(false);
    newIsFollowing ? follow(user_uuid) : unfollow(user_uuid);
    const mutation = newIsFollowing ? followUser : unfollowUser;
    mutation(
      { follower_uuid: user?.id!, following_uuid: user_uuid },
      {
        onSuccess: () => {
          if (invalidate) {
            utils.user.get_following.invalidate();
            utils.user.get_user_data.invalidate();
          }
        },
        onError: (error) => {
          newIsFollowing ? unfollow(user_uuid) : follow(user_uuid);
          Toast.show({
            text1: error.message,
            type: "error",
            visibilityTime: 1000,
            swipeable: false,
          });
        },
      }
    );
  };

  return (
    <Button
      onPress={toggleFollow}
      type={localFollowed ? "variant" : "primary"}
      style={[{ flex: 1, height: 32 }, style]}
    >
      {localFollowed ? "Following" : "Follow"}
    </Button>
  );
}
