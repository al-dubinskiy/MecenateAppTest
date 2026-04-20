import { client } from './client';
import {
  PostsResponse,
  PostDetailResponse,
  LikeResponse,
  CommentsResponse,
  CommentCreatedResponse,
  GetFeedParams,
  GetCommentsParams,
  CreateCommentRequest,
} from './types';

export const postsApi = {
  // Get posts feed with pagination and filtering
  getFeed: async (params: GetFeedParams = {}): Promise<PostsResponse> => {
    const { limit = 10, cursor, tier, simulate_error } = params;
    const queryParams: Record<string, any> = { limit };
    
    if (cursor) queryParams.cursor = cursor;
    if (tier) queryParams.tier = tier;
    if (simulate_error) queryParams.simulate_error = simulate_error;
    
    const response = await client.get('/posts', { params: queryParams });
    return response.data;
  },

  // Get single post by ID
  getPostById: async (postId: string): Promise<PostDetailResponse> => {
    const response = await client.get(`/posts/${postId}`);
    return response.data;
  },

  // Toggle like on a post
  toggleLike: async (postId: string): Promise<LikeResponse> => {
    const response = await client.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Get comments for a post with pagination
  getComments: async (postId: string, params: GetCommentsParams = {}): Promise<CommentsResponse> => {
    const { limit = 20, cursor } = params;
    const queryParams: Record<string, any> = { limit };
    
    if (cursor) queryParams.cursor = cursor;
    
    const response = await client.get(`/posts/${postId}/comments`, { params: queryParams });
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId: string, data: CreateCommentRequest): Promise<CommentCreatedResponse> => {
    const response = await client.post(`/posts/${postId}/comments`, data);
    return response.data;
  },
};