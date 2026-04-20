import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { Post } from '../api/types';

interface UseFeedOptions {
  tier?: 'free' | 'paid' | null;
  simulateError?: boolean;
}

export function useFeed({ tier, simulateError = false }: UseFeedOptions = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ['feed', tier],
    queryFn: async ({ pageParam }) => {
      const response = await postsApi.getFeed({limit: 10, cursor: pageParam, tier: tier || undefined, simulate_error: simulateError});
      if (!response.ok) {
        throw new Error(response.error?.message || 'Failed to load posts');
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const posts: Post[] = data?.pages.flatMap(page => page.posts) ?? [];

  // Функция для обновления лайка в ленте
  const updatePostLike = (postId: string, isLiked: boolean, likesCount: number) => {
    queryClient.setQueryData(['feed', tier], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: Post) =>
            post.id === postId ? { ...post, isLiked, likesCount } : post
          ),
        })),
      };
    });

    queryClient.setQueryData(['post', postId], (old: any) => {
      if (!old) return old;
      return { ...old, isLiked, likesCount };
    });
        
  };

  return {
    posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    updatePostLike,
  };
}