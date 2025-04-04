import { useState } from "react";
import Button from "../ui/Button";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";

export default function FollowButton({
  following,
  user_uuid,
}: {
  following: boolean;
  user_uuid: string;
}) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const [isFollowing, setIsFollowing] = useState(following);

  const { mutate: followUser } = trpc.user.follow_user.useMutation();
  const { mutate: unfollowUser } = trpc.user.unfollow_user.useMutation();

  const toggleFollow = () => {
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    const mutation = newIsFollowing ? followUser : unfollowUser;
    mutation(
      { follower_uuid: user?.id!, following_uuid: user_uuid },
      {
        onSuccess: () => {
          utils.user.get_following.invalidate();
          utils.user.get_user_data.invalidate();
        },
        onError: (error) => {
          setIsFollowing(!newIsFollowing);
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
      type={isFollowing ? "variant" : "primary"}
      style={{ flex: 1, height: 32 }}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
