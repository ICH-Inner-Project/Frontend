export interface PostResponse {
  id: string;
  title: string;
  content: string;
  description: string;
  image?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
