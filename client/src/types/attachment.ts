export interface Attachment {
  id: number;
  filename: string;
  url: string;
  solicitationId: number;
  createdAt: string;
}

export interface CreateAttachmentDTO {
  file: File;
  solicitationId: number;
}

export interface UpdateAttachmentDTO {
  filename?: string;
} 