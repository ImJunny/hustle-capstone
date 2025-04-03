import Button from "../ui/Button";
import Toast from "react-native-toast-message";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/server/lib/trpc-client";
import { PaymentMethod } from "@/server/actions/payment-method-actions";
import { CreatePaymentMethodSchema } from "@/app/(main)/(external)/add-payment";

type PaymentMethodSubmitButtonProps = {
  data?: any; // Define your data type if needed (e.g., payment method data)
  isEditing?: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PaymentSubmitButton({
  data,
  isEditing,
  setModalOpen,
}: PaymentMethodSubmitButtonProps) {
  const { handleSubmit } =
    useFormContext<z.infer<typeof CreatePaymentMethodSchema>>();

  const handleSave = async () => {
    // Currently no form submission logic for Stripe payment, so just show an in-progress message.
    Toast.show({
      text1: "Payment setup is in progress... Please wait.",
      type: "info",
      visibilityTime: 3000,
      swipeable: false,
    });

    // Placeholder: You could integrate the payment setup here when Stripe is ready.
  };

  return (
    <Button
      style={{ marginLeft: "auto" }}
      onPress={handleSubmit(handleSave)}
      disabled={true} // Disable button because payment setup is in progress
    >
      {isEditing ? "Save changes" : "Set up payment"}
    </Button>
  );
}
