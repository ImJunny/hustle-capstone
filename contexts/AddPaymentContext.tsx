import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePaymentMethodSchema } from "@/zod/zod-schemas";
import { PaymentMethod } from "@/server/actions/payment-method-actions";

type AddPaymentProviderProps = {
  data?: PaymentMethod;
  children: ReactNode;
  user_uuid: string;
};

export function AddPaymentProvider({
  data,
  children,
  user_uuid,
}: AddPaymentProviderProps) {
  const formMethods = useForm<z.infer<typeof CreatePaymentMethodSchema>>({
    resolver: zodResolver(CreatePaymentMethodSchema),
    defaultValues: {
      cardNumber: data ? `•••• •••• •••• ${data.card_last4}` : "",
      expiryMonth: "MM",
      expiryYear: "YYYY",
      cvc: "",
      isDefault: data?.is_default || false,
    },
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
