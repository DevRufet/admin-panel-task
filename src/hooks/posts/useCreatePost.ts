import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../../utils/api/mockApi";
import type { CreatePostRequest, Post } from "../../types/post";

interface MutationContext {
  previousPosts: Post[];
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Post, Error, CreatePostRequest, MutationContext>(
    {
      mutationFn: async (postData) => {
        try {
          const result = await mockApi.createPost(postData);

          return result;
        } catch (error) {
          console.error(" [useCreatePost] MOCKAPI XƏTASI:", error);
          throw error;
        }
      },

      onMutate: async (newPost): Promise<MutationContext> => {
        await queryClient.cancelQueries({ queryKey: ["posts"] });

        const previousPosts = queryClient.getQueryData<Post[]>(["posts"]) || [];

        const temporaryId = -Date.now();

        const optimisticPost: Post = {
          id: temporaryId,
          title: newPost.title,
          slug: newPost.slug,
          content: newPost.content,
          category: newPost.category,
          sharingTime: new Date().toISOString(),
          status: "draft",
          publishStatus: "public",

          coverImage:
            "https://via.placeholder.com/800x600/3D5DB2/FFFFFF?text=Loading+Cover+Image",
          author: {
            id: 1,
            name: "Current User",
            avatar: "https://i.pravatar.cc/150?img=1",
          },

          galleryImages: newPost.galleryImages
            ? newPost.galleryImages.map(
                (_, index) =>
                  `https://via.placeholder.com/400x300/3D5DB2/FFFFFF?text=Gallery+${
                    index + 1
                  }`
              )
            : [],
        };

        queryClient.setQueryData<Post[]>(["posts"], (old = []) => {
          const newData = [optimisticPost, ...old];

          return newData;
        });

        return { previousPosts };
      },

      onError: (err, newPost, context) => {
        console.error(" [useCreatePost] onError:", err);

        if (context?.previousPosts) {
          queryClient.setQueryData(["posts"], context.previousPosts);
        }
      },

      onSuccess: (newPost, variables, context) => {
        mockApi.getPosts().then((posts) => {
          posts.forEach((post, index) => {});
        });

        queryClient.setQueryData<Post[]>(["posts"], (old = []) => {
          const updatedData = old.map((post) => (post.id < 0 ? newPost : post));

          return updatedData;
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    }
  );

  return {
    ...mutation,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
