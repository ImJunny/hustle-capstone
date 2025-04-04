import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePaymentMethodSchema } from "@/app/(main)/(external)/add-payment";
import { PaymentMethod } from "@/server/actions/payment-method-actions";

type CreatePaymentProviderProps = {
  data?: PaymentMethod;
  children: ReactNode;
};

export function AddPaymentProvider({
  data,
  children,
}: CreatePaymentProviderProps) {
  const formMethods = useForm<z.infer<typeof CreatePaymentMethodSchema>>({
    resolver: zodResolver(CreatePaymentMethodSchema),
    defaultValues: {
      card_last4: data?.card_last4 || "", // Last 4 digits of the card
    },
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
