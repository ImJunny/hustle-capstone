import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Suspense, useState } from "react";
import { StyleSheet } from "react-native";
import { BackHeader } from "@/components/headers/Headers";
import { useAuthData } from "@/contexts/AuthContext";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getUserData, updateUserProfile } from "@/server/lib/user";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const queryClient = useQueryClient();

  const { user } = useAuthData();
  const { data } = useSuspenseQuery({
    queryKey: ["userDataQuery"],
    queryFn: () => getUserData(user?.id!),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["userDataMutate"],
    mutationFn: async () => {
      if (
        data.username !== username ||
        data.first_name !== firstName ||
        data.last_name !== lastName ||
        data.bio !== bio
      ) {
        await updateUserProfile(user?.id!, username, firstName, lastName, bio);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDataQuery"] });
      Toast.show({
        text1: "Profile saved",
        swipeable: false,
      });
    },
    onError: () => {
      Toast.show({
        text1: "Error in saving profile",
        type: "error",
        swipeable: false,
      });
    },
  });

  const themeColor = useThemeColor();
  const [username, setUsername] = useState(data.username!);
  const [firstName, setFirstName] = useState(data.first_name!);
  const [lastName, setLastName] = useState(data.last_name!);
  const [bio, setBio] = useState(data.bio!);

  return (
    <>
      <BackHeader />

      <View style={styles.container} color="background">
        <Suspense fallback={<Text>Loading...</Text>}>
          <View>
            <Text style={styles.inputLabel} weight="bold" size="lg">
              Username
            </Text>
            <View
              style={{
                flexDirection: "row",
                borderRadius: 6,
                borderWidth: 1,
                alignItems: "center",
                paddingHorizontal: 16,
                gap: 0,
                borderColor: themeColor.foreground,
              }}
            >
              <Input
                style={{
                  paddingHorizontal: 0,
                }}
                type="clear"
                value={"@"}
                editable={false}
              />
              <Input
                style={{
                  paddingHorizontal: 0,
                  flex: 1,
                }}
                type="clear"
                placeholder="username"
                value={username}
                onChangeText={(text) => setUsername(text.toLowerCase())}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel} weight="bold" size="lg">
                First name
              </Text>
              <Input
                type="outline"
                placeholder="First"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel} weight="bold" size="lg">
                Last name
              </Text>
              <Input
                type="outline"
                placeholder="Last"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
          </View>
          <View>
            <Text style={styles.inputLabel} weight="bold" size="lg">
              Bio
            </Text>
            <Input
              type="outline"
              placeholder="Describe yourself..."
              value={bio}
              onChangeText={(text) => setBio(text)}
              multiline={true}
              style={{ height: 100 }}
              textAlignVertical="top"
            />
          </View>

          <Button
            style={{ alignSelf: "flex-end", minWidth: 120 }}
            disabled={isPending}
            onPress={() => mutate()}
          >
            {isPending ? "Saving" : "Save"}
          </Button>
        </Suspense>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    marginBottom: 4,
  },
  input: {
    width: "100%",
  },
  separatorContainer: {
    justifyContent: "center",
  },
  separatorText: {
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
  },
  bottomText: {
    textAlign: "center",
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
});
