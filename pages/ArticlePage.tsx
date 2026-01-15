
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Article, Comment } from '../types';

interface ArticlePageProps {
  articles: Article[];
  comments: Comment[];
  onCommentAdd: (c: Comment) => void;
  onArticleUpdate: (id: string, updates: Partial<Article>) => void;
}

type Reaction = 'like' | 'dislike' | null;

const ArticlePage: React.FC<ArticlePageProps> = ({ articles, comments, onCommentAdd, onArticleUpdate }) => {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);
  const articleComments = comments.filter(c => c.articleId === id);

  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userReaction, setUserReaction] = useState<Reaction>(null);

  // Load user reaction from localStorage on mount
  useEffect(() => {
    if (article) {
      const storedReactions = JSON.parse(localStorage.getItem('lumina_user_reactions') || '{}');
      setUserReaction(storedReactions[article.id] || null);
    }
  }, [article?.id]);

  if (!article) return <Navigate to="/" />;

  const updateStoredReaction = (newType: Reaction) => {
    const storedReactions = JSON.parse(localStorage.getItem('lumina_user_reactions') || '{}');
    if (newType) {
      storedReactions[article.id] = newType;
    } else {
      delete storedReactions[article.id];
    }
    localStorage.setItem('lumina_user_reactions', JSON.stringify(storedReactions));
    setUserReaction(newType);
  };

  const handleLike = () => {
    let likesDelta = 0;
    let dislikesDelta = 0;
    let nextReaction: Reaction = null;

    if (userReaction === 'like') {
      // Undo like
      likesDelta = -1;
      nextReaction = null;
    } else if (userReaction === 'dislike') {
      // Switch from dislike to like
      dislikesDelta = -1;
      likesDelta = 1;
      nextReaction = 'like';
    } else {
      // New like
      likesDelta = 1;
      nextReaction = 'like';
    }

    onArticleUpdate(article.id, { 
      likes: Math.max(0, article.likes + likesDelta),
      dislikes: Math.max(0, article.dislikes + dislikesDelta)
    });
    updateStoredReaction(nextReaction);
  };

  const handleDislike = () => {
    let likesDelta = 0;
    let dislikesDelta = 0;
    let nextReaction: Reaction = null;

    if (userReaction === 'dislike') {
      // Undo dislike
      dislikesDelta = -1;
      nextReaction = null;
    } else if (userReaction === 'like') {
      // Switch from like to dislike
      likesDelta = -1;
      dislikesDelta = 1;
      nextReaction = 'dislike';
    } else {
      // New dislike
      dislikesDelta = 1;
      nextReaction = 'dislike';
    }

    onArticleUpdate(article.id, { 
      likes: Math.max(0, article.likes + likesDelta),
      dislikes: Math.max(0, article.dislikes + dislikesDelta)
    });
    updateStoredReaction(nextReaction);
  };

  const handleRating = (stars: number) => {
    const newRatingCount = article.ratingCount + 1;
    const newAverage = ((article.rating * article.ratingCount) + stars) / newRatingCount;
    onArticleUpdate(article.id, { 
      rating: parseFloat(newAverage.toFixed(1)), 
      ratingCount: newRatingCount 
    });
    setUserRating(stars);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onCommentAdd({
      id: Math.random().toString(36).substr(2, 9),
      articleId: article.id,
      author: 'Guest Reader',
      text: newComment,
      createdAt: new Date().toISOString(),
      reactions: {}
    });
    setNewComment('');
  };

  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    let shareUrl = '';
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto pt-8 md:pt-16 px-4">
        <div className="mb-6 md:mb-8">
          <span className="text-indigo-600 font-bold tracking-widest text-[10px] md:text-xs uppercase">{article.category}</span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mt-2 md:mt-4 serif leading-tight">{article.title}</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-6 md:mt-8 gap-4 border-y border-slate-100 py-4 md:py-6">
            <div className="flex items-center gap-3 md:gap-4 flex-grow">
              <img src={`https://ui-avatars.com/api/?name=${article.author}&background=random`} alt={article.author} className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-sm" />
              <div>
                <p className="font-bold text-slate-900 text-sm md:text-base">{article.author}</p>
                <p className="text-slate-500 text-xs">Published {new Date(article.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button onClick={() => shareToSocial('twitter')} className="p-2 text-slate-400 hover:text-indigo-400 transition bg-slate-50 rounded-full sm:bg-transparent" title="Share on Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button onClick={() => shareToSocial('facebook')} className="p-2 text-slate-400 hover:text-blue-600 transition bg-slate-50 rounded-full sm:bg-transparent" title="Share on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.356 5 15.144 5H18V0h-3.877C10.535 0 9 1.791 9 4.357V8z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[300px] md:h-[600px] overflow-hidden">
        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg prose-slate max-w-none">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-6 leading-relaxed text-slate-700 text-base md:text-lg">{para}</p>
          ))}
        </div>

        {/* Engagement */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition group ${userReaction === 'like' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 hover:bg-slate-100'}`}
            >
              <svg className={`w-5 h-5 md:w-6 md:h-6 ${userReaction === 'like' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} fill={userReaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.704a2 2 0 011.94 2.485l-1.202 6a2 2 0 01-1.94 1.515H7a2 2 0 01-2-2V10a2 2 0 01.447-1.265l3.18-4.24a2 2 0 013.146.415L14 10z" />
              </svg>
              <span className="font-semibold text-sm md:text-base">{article.likes}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition group ${userReaction === 'dislike' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-slate-50 hover:bg-slate-100'}`}
            >
              <svg className={`w-5 h-5 md:w-6 md:h-6 ${userReaction === 'dislike' ? 'text-white' : 'text-slate-400 group-hover:text-red-600'}`} fill={userReaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.296a2 2 0 01-1.94-2.485l1.202-6a2 2 0 011.94-1.515H17a2 2 0 012 2v10a2 2 0 01-.447 1.265l-3.18 4.24a2 2 0 01-3.146-.415L10 14z" />
              </svg>
              <span className="font-semibold text-sm md:text-base">{article.dislikes}</span>
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="flex items-center gap-1 mb-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleRating(star)} className="focus:outline-none p-1">
                  <svg className={`w-5 h-5 md:w-6 md:h-6 ${star <= (userRating || article.rating) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium">{article.rating} rating from {article.ratingCount} users</p>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-16 md:mt-20">
          <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 serif">Comments ({articleComments.length})</h3>
          
          <form onSubmit={submitComment} className="mb-8 md:mb-12">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[100px] md:min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition mb-4 text-sm md:text-base outline-none"
            />
            <button className="w-full sm:w-auto bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-600 transition shadow-lg shadow-indigo-100">
              Post Comment
            </button>
          </form>

          <div className="space-y-6 md:space-y-8">
            {articleComments.map(comment => (
              <div key={comment.id} className="flex gap-3 md:gap-4">
                <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0 shadow-sm" alt="" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs md:text-sm">{comment.author}</span>
                    <span className="text-slate-400 text-[10px] md:text-xs">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3 text-sm md:text-base">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] md:text-xs text-slate-400 font-bold uppercase hover:text-indigo-600 transition tracking-wider">Reply</button>
                    <button className="text-[10px] md:text-xs text-slate-400 font-bold uppercase hover:text-indigo-600 transition tracking-wider">React</button>
                  </div>
                </div>
              </div>
            ))}
            {articleComments.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 px-4">
                <p className="text-sm md:text-base">No comments yet. Be the first to start the conversation!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticlePage;
