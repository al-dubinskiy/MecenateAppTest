import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api/posts";
import { Alert } from "react-native";
import { Post } from "../api/types";

export function usePost(postId: string) {
  const queryClient = useQueryClient();

  // Get post details
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await postsApi.getPostById(postId);
      if (!response.ok) {
        throw new Error(response.error?.message || "Failed to load post");
      }
      return response.data.post;
    },
    enabled: !!postId,
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: () => postsApi.toggleLike(postId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["feed"] });
    },
    onSuccess: (response) => {
      if (response.ok) {
        // Update with server response
        queryClient.setQueryData(["post", postId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            isLiked: response.data.isLiked,
            likesCount: response.data.likesCount,
          };
        });
      }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["post", postId], context?.previousPost);
      Alert.alert("Ошибка", "Не удалось поставить лайк");
    },
    onSettled: () => {
      // Refetch to ensure consistency
      // queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return {
    post: data,
    isLoading,
    isError,
    refetch,
    toggleLike: toggleLikeMutation.mutate,
    isTogglingLike: toggleLikeMutation.isPending,
  };
}
