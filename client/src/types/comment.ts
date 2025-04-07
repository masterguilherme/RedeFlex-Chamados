export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  solicitationId: number;
}

export interface CreateCommentDTO {
  content: string;
  solicitationId: number;
}

export interface CommentWithUser extends Comment {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UpdateCommentDTO {
  content?: string;
}

export interface CommentRequestBody {
  content: string;
  solicitationId: number;
  userId: number;
} 