
import { Article, Comment } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Web Architecture: Beyond the Client-Side',
    excerpt: 'Exploring how hybrid rendering and edge computing are reshaping the way we build modern web applications.',
    content: 'The web is evolving faster than ever. From the early days of static HTML to the explosion of Single Page Applications (SPAs), we are now witnessing a shift towards hyper-efficiency at the edge. Technologies like React Server Components and edge-native frameworks are proving that performance is once again the priority...\n\n### The Rise of Edge\nEdge computing allows us to run logic closer to the user, reducing latency and improving security. By offloading complex data fetching to regional servers, we can deliver rich experiences on low-powered devices.',
    author: 'Elena Vance',
    coverImage: 'https://picsum.photos/seed/tech1/1200/600',
    category: 'Technology',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    scheduledAt: null,
    status: 'published',
    likes: 42,
    dislikes: 2,
    rating: 4.8,
    ratingCount: 15
  },
  {
    id: '2',
    title: 'Mindfulness in the Digital Age',
    excerpt: 'How to maintain focus and mental clarity in a world of constant notifications and digital noise.',
    content: 'Our attention is the most valuable currency in the modern economy. Every app, website, and device is designed to capture it. To thrive, we must develop strong boundaries and deliberate practices for digital detoxing.\n\n### Practical Strategies\n1. Disable non-human notifications.\n2. Create device-free zones in your home.\n3. Practice deep work sessions of at least 90 minutes.',
    author: 'Mark Sterling',
    coverImage: 'https://picsum.photos/seed/life/1200/600',
    category: 'Lifestyle',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    scheduledAt: null,
    status: 'published',
    likes: 128,
    dislikes: 5,
    rating: 4.5,
    ratingCount: 30
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    articleId: '1',
    author: 'Julian Reed',
    text: 'Fascinating read! I am really looking forward to seeing how edge computing integrates with current mobile workflows.',
    createdAt: new Date().toISOString(),
    reactions: { '👍': 5, '❤️': 2 }
  }
];

export const CATEGORIES = ['Technology', 'Lifestyle', 'Business', 'Art', 'Science'];
