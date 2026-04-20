import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { Comment } from '../api/types';
import { Alert } from 'react-native';

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  // Get comments with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const response = await postsApi.getComments(postId, { 
        limit: 20, 
        cursor: pageParam 
      });
      if (!response.ok) {
        throw new Error(response.error?.message || 'Failed to load comments');
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    enabled: !!postId,
  });

  const comments: Comment[] = data?.pages.flatMap(page => page.comments) ?? [];

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text: string) => postsApi.addComment(postId, { text }),
    onSuccess: (response) => {
      if (response.ok) {
        // Invalidate comments query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        // Also invalidate post to update comments count
        queryClient.invalidateQueries({ queryKey: ['feed'] });
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      } else {
        Alert.alert('Ошибка', response.error?.message || 'Не удалось добавить комментарий');
      }
    },
    onError: () => {
      Alert.alert('Ошибка', 'Не удалось добавить комментарий');
    },
  });

  return {
    comments,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
  };
}