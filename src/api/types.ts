// Author types
export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

// Post types
export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: 'free' | 'paid';
  createdAt: string;
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

// Request parameters
export interface GetFeedParams {
  limit?: number;  // max 20
  cursor?: string | null;
  tier?: 'free' | 'paid';
  simulate_error?: boolean;
}

export interface GetCommentsParams {
  limit?: number;
  cursor?: string | null;
}

export interface CreateCommentRequest {
  text: string;
}

// Response types
export interface PostsResponse {
  ok: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface PostDetailResponse {
  ok: boolean;
  data: {
    post: Post;
  };
}

export interface LikeResponse {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

export interface CommentsResponse {
  ok: boolean;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface CommentCreatedResponse {
  ok: boolean;
  data: {
    comment: Comment;
  };
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = T | ErrorResponse;

// Error codes
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}