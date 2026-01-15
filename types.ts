
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  category: string;
  publishedAt: string; // ISO String
  scheduledAt: string | null; // ISO String or null
  status: 'published' | 'draft' | 'scheduled';
  likes: number;
  dislikes: number;
  rating: number; // 0-5
  ratingCount: number;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  text: string;
  createdAt: string;
  reactions: Record<string, number>;
}

export interface AppState {
  articles: Article[];
  comments: Comment[];
}
