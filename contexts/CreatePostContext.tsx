import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePostSchema } from "@/zod/zod-schemas";
import { PostDetailsInfo } from "@/server/actions/post-actions";

type CreatePostProviderProps = {
  data?: PostDetailsInfo;
  children: ReactNode;
};

const CreatePostContext = createContext<{
  isNewImages: boolean;
  setIsNewImages: Dispatch<SetStateAction<boolean>>;
}>({
  isNewImages: false,
  setIsNewImages: () => {},
});

export function useCreatePostContext() {
  return useContext(CreatePostContext);
}

export function CreatePostProvider({
  data,
  children,
}: CreatePostProviderProps) {
  const formMethods = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: data?.title || undefined,
      description: data?.description || undefined,
      min_rate: data?.min_rate || undefined,
      max_rate: data?.max_rate || undefined,
      location_type: (data?.location_type as "local" | "remote") || undefined,
      location_address: data?.location_address || undefined,
      due_date: data?.due_date ? new Date(data.due_date) : undefined,
      type: data?.type || "work",
      images: data?.post_images.map((image) => image.image_url) || [],
    },
  });
  formMethods.watch("type");

  const [isNewImages, setIsNewImages] = useState(false);
  return (
    <CreatePostContext.Provider
      value={{
        isNewImages,
        setIsNewImages,
      }}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </CreatePostContext.Provider>
  );
}
