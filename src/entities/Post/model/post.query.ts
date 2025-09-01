import { UPDATE_POST } from "@/shared/lib/graphql/queries";
import { useMutation } from "@apollo/client";

export const useUpdatePostMutation = () => {
  console.log("useUpdatePostMutation");
  return useMutation(UPDATE_POST, {
    onCompleted: (data) => {
      console.log("Post 업데이트 완료:", data);
    },
    onError: (error) => {
      console.error("Post 업데이트 실패:", error);
    },
  });
};
