import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../../utils/api/mockApi";
import type { UpdatePostRequest, Post } from "../../types/post";

interface MutationContext {
  previousPosts: Post[];
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Post, Error, UpdatePostRequest, MutationContext>(
    {
      mutationFn: mockApi.updatePost,

      onMutate: async (updatedPost): Promise<MutationContext> => {
        await queryClient.cancelQueries({ queryKey: ["posts"] });

        const previousPosts = queryClient.getQueryData<Post[]>(["posts"]) || [];

        queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
          old.map((post) =>
            post.id === updatedPost.id
              ? ({ ...post, ...updatedPost } as Post)
              : post
          )
        );

        return { previousPosts };
      },

      onError: (err, updatedPost, context) => {
        console.error(`Post #${updatedPost.id} yenilənərkən xəta:`, err);

        if (context?.previousPosts) {
          queryClient.setQueryData(["posts"], context.previousPosts);
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    }
  );

  return {
    ...mutation,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
