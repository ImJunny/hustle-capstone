import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import { router } from "expo-router";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import View from "../ui/View";

export default function CommentsSheet() {
  const ref = useRef<BottomSheetMethods>(null);
  const setCommentsSheetRef = useCommentsStore(
    (state) => state.setCommentsSheetRef
  );

  const uuid = useCommentsStore((state) => state.postUUID);
  console.log(uuid);

  useEffect(() => {
    setCommentsSheetRef(ref);
  }, [setCommentsSheetRef]);

  return (
    <Sheet
      sheetRef={ref}
      title="Comments"
      snapPoints={[1, "50%", "80%"]}
      handleComponent={null}
    >
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <Comment />
      </BottomSheetView>
    </Sheet>
  );
}

function Comment() {
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
}
