import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import { exampleReview } from "@/server/utils/example-data";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthData } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoadingView from "@/components/ui/LoadingView";
// import { getUserData } from "@/server/utils/user";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

interface ReviewProps {
  displayImage: "user" | "service" | "none";
}
export default function Review({ displayImage }: ReviewProps) {
  // const { id } = useLocalSearchParams();
  // const review = exampleReview.find((review) => review.uuid === id);
  // const themeColor = useThemeColor();
  // const { user } = useAuthData();
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["userDataQuery", user],
  //   queryFn: () => getUserData(user?.id!),
  // });

  return;
  // if (error) {
  //   return (
  //     <View>
  //       <Text>User not found.</Text>
  //     </View>
  //   );
  // }

  // if (isLoading) {
  //   return <LoadingView />;
  // }

  // if (!review) {
  //   return <Text>Review not found</Text>;
  // }

  // return (
  //   <View style={styles.container}>
  //     <View
  //       style={{
  //         padding: 15,
  //         borderBottomColor: "grey",
  //         borderBottomWidth: 2,
  //       }}
  //     >
  //       <View style={styles.bottomContainer}>
  //         <View style={styles.nameContainer}>
  //           <Text color="white" weight="semibold" size="sm">
  //             {review.user_name} | {review.date}
  //           </Text>

  //           <View style={styles.starsContainer}>
  //             <Icon name="star" />
  //             <Icon name="star" />
  //             <Icon name="star" />
  //             <Icon name="star" />
  //             <Icon name="star" />
  //             <Text style={styles.ratingText}>4.5/5</Text>
  //           </View>
  //         </View>
  //         <View>
  //           {displayImage === "user" && (
  //             <ImagePlaceholder
  //               width={100}
  //               height={100}
  //               style={styles.imgStyle}
  //             />
  //           )}
  //         </View>
  //       </View>

  //       <View style={styles.descriptionContainer}>
  //         <Text numberOfLines={15} ellipsizeMode="tail" color="muted-dark">
  //           {review.description}
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    marginVertical: 5,
  },
  ratingText: {
    marginHorizontal: 5,
    color: "white",
    fontWeight: "semibold",
  },
  imgStyle: {
    borderRadius: 4,
  },
  descriptionContainer: {
    flexDirection: "row",
    marginVertical: 15,
    marginBottom: 15,
  },
});
