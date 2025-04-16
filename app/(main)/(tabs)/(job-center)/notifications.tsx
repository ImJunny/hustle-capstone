import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import Text from "@/components/ui/Text";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { NotificationData } from "@/server/actions/notification-actions";
import View from "@/components/ui/View";
import { Image } from "expo-image";
import { getRelativeDate } from "@/utils/helpers";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { Alert, View as RNView } from "react-native";
import IconButton from "@/components/ui/IconButton";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { UseMutateFunction } from "@tanstack/react-query";
import type { Swipeable as SwipeableType } from "react-native-gesture-handler";

export default function NotificationsScreen() {
  const utils = trpc.useUtils();
  const { user } = useAuthData();

  const { data, isLoading, refetch, error } =
    trpc.notification.get_notifications.useQuery({
      user_uuid: user?.id!,
    });

  const [notifs, setNotifs] = useState<NotificationData[] | undefined>(
    data as any
  );
  useEffect(() => {
    setNotifs(data as NotificationData[] | undefined);
  }, [data]);

  const { mutate: removeNotif } =
    trpc.notification.remove_notification.useMutation({
      onSuccess: () => {
        utils.notification.get_notifications.invalidate();
      },
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
        });
      },
    });

  if (!user || isLoading || error) {
    return (
      <LoadingScreen
        refetch={refetch}
        data={data}
        loads={isLoading}
        errors={[error]}
        header={<SimpleHeader title="Notifications" />}
      />
    );
  }

  if (notifs?.length === 0) {
    return (
      <>
        <SimpleHeader title="Notifications" />
        <ScrollView
          refetch={refetch}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No notifications</Text>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Notifications" />
      <ScrollView refetch={refetch}>
        {notifs?.map((notif, i) => (
          <Notification
            key={i}
            data={notif as unknown as NotificationData}
            setNotifs={setNotifs}
            removeNotif={removeNotif}
          />
        ))}
      </ScrollView>
    </>
  );
}

function Notification({
  data,
  setNotifs,
  removeNotif,
}: {
  data: NotificationData;
  setNotifs: Dispatch<SetStateAction<NotificationData[] | undefined>>;
  removeNotif: UseMutateFunction<unknown, unknown, { uuid: string }, unknown>;
}) {
  const formattedDate = getRelativeDate(String(data.notification.created_at));
  const swipeableRef = useRef<SwipeableType>(null); // 💡 Create ref

  const handleRedirect = () =>
    router.push(`/post/${data.notification.post_uuid}`);

  const handleDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              swipeableRef.current?.close(); // 👈 Close swipe first
              removeNotif({ uuid: data.notification.uuid });
              setNotifs((prevNotifs) =>
                prevNotifs?.filter(
                  (notif) => notif.notification.uuid !== data.notification.uuid
                )
              );
            } catch (error) {
              console.error("Failed to delete notification:", error);
            }
          },
        },
      ]
    );
  };

  const renderRightActions = () => (
    <RNView
      style={{
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
      }}
    >
      <IconButton name="trash" size={24} color="white" onPress={handleDelete} />
    </RNView>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
      <View
        color="background"
        style={{
          padding: 16,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text color="muted" size="sm">
            {formattedDate}
          </Text>
          <Text>{data.notification.text}</Text>
        </View>

        {data.image_url && (
          <TouchableOpacity onPress={handleRedirect}>
            <Image
              source={{ uri: data.image_url }}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </Swipeable>
  );
}
