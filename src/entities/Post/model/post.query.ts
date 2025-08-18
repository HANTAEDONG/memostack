import { CreatePostData } from "../lib/post.types";
import { useQuery } from "@tanstack/react-query";
import { PostService } from "./post.service";

export const useCreatePostQuery = (postData: CreatePostData) => {
  return useQuery({
    queryKey: ["post", postData.title],
    queryFn: async () => {
      const response = await PostService.create(postData);
      return response;
    },
    enabled: !!postData,
  });
};
