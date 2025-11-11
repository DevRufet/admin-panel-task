import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../../utils/api/mockApi";
import type { Post } from "../../types/post";

interface MutationContext {
  previousPosts: Post[];
  deletedPostId: number;
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean },
    Error,
    number,
    MutationContext
  >({
    mutationFn: (id: number) => mockApi.deletePost(id),

    onMutate: async (id): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]) || [];

      queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
        old.filter((post) => post.id !== id)
      );

      return { previousPosts, deletedPostId: id };
    },

    onError: (err, id, context) => {
      console.error("Post silinərkən xəta:", err);

      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    ...mutation,
    isDeleting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
