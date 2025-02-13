import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { ProfileHeader } from "@/components/headers/Headers";
import ProfileBio from "@/components/profile/profileBio";

export default function ProfileMainScreen() {
  return (
    <>
      <ProfileHeader />
      <View>
        <ProfileBio
          data={{
            uuid: "",
            bio: "",
            user_name: "John smith",
            name: "",
          }}
        />
        <View>
          <Text
            color="muted"
            style={{
              paddingHorizontal: 15,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation...
          </Text>
        </View>
      </View>
    </>
  );
}
