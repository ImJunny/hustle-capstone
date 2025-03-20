import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { Address } from "@/server/actions/address-actions";

type CreateAddressProviderProps = {
  data?: Address;
  children: ReactNode;
};

export function CreateAddressProvider({
  data,
  children,
}: CreateAddressProviderProps) {
  const formMethods = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues: {
      address_title: data?.title || "",
      address_line_1: data?.address_line_1 || "",
      address_line_2: data?.address_line_2 || "",
      city: data?.city || "",
      state: data?.state?.toLowerCase() || "",
      country: data?.country?.toLowerCase().replaceAll(" ", "_") || "",
      zip: data?.zip_code || "",
    },
  });

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
