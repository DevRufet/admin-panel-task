import { useQuery } from "@tanstack/react-query";
import { mockApi } from "../../utils/api/mockApi";
import type { Post } from "../../types/post";

export const usePosts = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: () => mockApi.getPosts(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    posts,
    isLoading,
    isError,
    error: error?.message,
    refetch,
    isFetching,
    isEmpty: !isLoading && posts.length === 0,
    totalCount: posts.length,
  };
};
