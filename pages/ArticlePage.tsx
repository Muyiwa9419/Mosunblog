
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Article, Comment } from '../types';

interface ArticlePageProps {
  articles: Article[];
  comments: Comment[];
  onCommentAdd: (c: Comment) => void;
  onArticleUpdate: (id: string, updates: Partial<Article>) => void;
  onCommentUpdate: (id: string, updates: Partial<Comment>) => void;
}

type Reaction = 'like' | 'dislike' | null;

interface UserEngagement {
  reaction: Reaction;
  rating: number | null;
}

const COMMENT_REACTIONS = ['👍', '❤️', '😂', '😮', '👏', '🔥'];

const ArticlePage: React.FC<ArticlePageProps> = ({ articles, comments, onCommentAdd, onArticleUpdate, onCommentUpdate }) => {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);
  const articleComments = comments.filter(c => c.articleId === id);

  const [newComment, setNewComment] = useState('');
  const [userEngagement, setUserEngagement] = useState<UserEngagement>({ reaction: null, rating: null });
  const [userCommentReactions, setUserCommentReactions] = useState<Record<string, string>>({});

  // Load user engagement and comment reactions from localStorage on mount
  useEffect(() => {
    if (article) {
      const stored = JSON.parse(localStorage.getItem('lumina_user_engagement') || '{}');
      setUserEngagement(stored[article.id] || { reaction: null, rating: null });
      
      const storedCommentReactions = JSON.parse(localStorage.getItem('lumina_comment_reactions') || '{}');
      setUserCommentReactions(storedCommentReactions);
    }
  }, [article?.id]);

  if (!article) return <Navigate to="/" />;

  const updateStoredEngagement = (updates: Partial<UserEngagement>) => {
    const stored = JSON.parse(localStorage.getItem('lumina_user_engagement') || '{}');
    const newEntry = { ...(stored[article.id] || { reaction: null, rating: null }), ...updates };
    
    if (newEntry.reaction === null && newEntry.rating === null) {
      delete stored[article.id];
    } else {
      stored[article.id] = newEntry;
    }
    
    localStorage.setItem('lumina_user_engagement', JSON.stringify(stored));
    setUserEngagement(newEntry);
  };

  const handleLike = () => {
    let likesDelta = 0;
    let dislikesDelta = 0;
    let nextReaction: Reaction = null;

    if (userEngagement.reaction === 'like') {
      likesDelta = -1;
      nextReaction = null;
    } else if (userEngagement.reaction === 'dislike') {
      dislikesDelta = -1;
      likesDelta = 1;
      nextReaction = 'like';
    } else {
      likesDelta = 1;
      nextReaction = 'like';
    }

    onArticleUpdate(article.id, { 
      likes: Math.max(0, article.likes + likesDelta),
      dislikes: Math.max(0, article.dislikes + dislikesDelta)
    });
    updateStoredEngagement({ reaction: nextReaction });
  };

  const handleDislike = () => {
    let likesDelta = 0;
    let dislikesDelta = 0;
    let nextReaction: Reaction = null;

    if (userEngagement.reaction === 'dislike') {
      dislikesDelta = -1;
      nextReaction = null;
    } else if (userEngagement.reaction === 'like') {
      likesDelta = -1;
      dislikesDelta = 1;
      nextReaction = 'dislike';
    } else {
      dislikesDelta = 1;
      nextReaction = 'dislike';
    }

    onArticleUpdate(article.id, { 
      likes: Math.max(0, article.likes + likesDelta),
      dislikes: Math.max(0, article.dislikes + dislikesDelta)
    });
    updateStoredEngagement({ reaction: nextReaction });
  };

  const handleRating = (stars: number) => {
    const currentRating = userEngagement.rating;
    let newAverage: number;
    let newCount: number;

    const totalSum = article.rating * article.ratingCount;

    if (currentRating === stars) {
      newCount = Math.max(0, article.ratingCount - 1);
      newAverage = newCount > 0 ? (totalSum - stars) / newCount : 0;
      updateStoredEngagement({ rating: null });
    } else if (currentRating !== null) {
      newCount = article.ratingCount;
      newAverage = (totalSum - currentRating + stars) / newCount;
      updateStoredEngagement({ rating: stars });
    } else {
      newCount = article.ratingCount + 1;
      newAverage = (totalSum + stars) / newCount;
      updateStoredEngagement({ rating: stars });
    }

    onArticleUpdate(article.id, { 
      rating: parseFloat(newAverage.toFixed(1)), 
      ratingCount: newCount 
    });
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

  const handleCommentReaction = (comment: Comment, emoji: string) => {
    const currentEmoji = userCommentReactions[comment.id];
    const newReactions = { ...comment.reactions };
    const storedReactions = { ...userCommentReactions };

    if (currentEmoji === emoji) {
      newReactions[emoji] = Math.max(0, (newReactions[emoji] || 1) - 1);
      if (newReactions[emoji] === 0) delete newReactions[emoji];
      delete storedReactions[comment.id];
    } else {
      if (currentEmoji) {
        newReactions[currentEmoji] = Math.max(0, (newReactions[currentEmoji] || 1) - 1);
        if (newReactions[currentEmoji] === 0) delete newReactions[currentEmoji];
      }
      newReactions[emoji] = (newReactions[emoji] || 0) + 1;
      storedReactions[comment.id] = emoji;
    }

    onCommentUpdate(comment.id, { reactions: newReactions });
    localStorage.setItem('lumina_comment_reactions', JSON.stringify(storedReactions));
    setUserCommentReactions(storedReactions);
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
              <button onClick={() => shareToSocial('twitter')} className="p-2 text-slate-400 hover:text-indigo-400 transition transform hover:scale-110 active:scale-95 bg-slate-50 rounded-full sm:bg-transparent" title="Share on Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button onClick={() => shareToSocial('facebook')} className="p-2 text-slate-400 hover:text-blue-600 transition transform hover:scale-110 active:scale-95 bg-slate-50 rounded-full sm:bg-transparent" title="Share on Facebook">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform active:scale-90 group ${userEngagement.reaction === 'like' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' : 'bg-slate-50 hover:bg-slate-100 hover:scale-105'}`}
            >
              <svg className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${userEngagement.reaction === 'like' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} fill={userEngagement.reaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.704a2 2 0 011.94 2.485l-1.202 6a2 2 0 01-1.94 1.515H7a2 2 0 01-2-2V10a2 2 0 01.447-1.265l3.18-4.24a2 2 0 013.146.415L14 10z" />
              </svg>
              <span className="font-semibold text-sm md:text-base">{article.likes}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform active:scale-90 group ${userEngagement.reaction === 'dislike' ? 'bg-red-600 text-white shadow-lg shadow-red-100 scale-105' : 'bg-slate-50 hover:bg-slate-100 hover:scale-105'}`}
            >
              <svg className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${userEngagement.reaction === 'dislike' ? 'text-white' : 'text-slate-400 group-hover:text-red-600'}`} fill={userEngagement.reaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.296a2 2 0 01-1.94-2.485l1.202-6a2 2 0 011.94-1.515H17a2 2 0 012 2v10a2 2 0 01-.447 1.265l-3.18 4.24a2 2 0 01-3.146-.415L10 14z" />
              </svg>
              <span className="font-semibold text-sm md:text-base">{article.dislikes}</span>
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(star => {
                const isSelected = userEngagement.rating !== null && star <= userEngagement.rating;
                const isAverage = userEngagement.rating === null && star <= Math.round(article.rating);
                return (
                  <button 
                    key={star} 
                    onClick={() => handleRating(star)} 
                    className={`focus:outline-none p-1 transition-all duration-200 transform hover:scale-125 active:scale-75 ${isSelected ? 'text-yellow-400 scale-110' : isAverage ? 'text-yellow-400/50' : 'text-slate-200'}`}
                  >
                    <svg className="w-5 h-5 md:w-7 md:h-7 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight">
              {userEngagement.rating ? `Your rating: ${userEngagement.rating}.0` : `Average: ${article.rating}`} 
              <span className="mx-1 opacity-30">•</span> 
              {article.ratingCount} reviews
            </p>
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

          <div className="space-y-10">
            {articleComments.map(comment => (
              <div key={comment.id} className="flex gap-4 group">
                <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-10 h-10 rounded-full shrink-0 shadow-sm" alt="" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{comment.author}</span>
                    <span className="text-slate-400 text-xs">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4 text-sm md:text-base">{comment.text}</p>
                  
                  {/* Interactive Comment Actions */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Active Reactions List */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(comment.reactions).map(([emoji, count]) => {
                        const isSelected = userCommentReactions[comment.id] === emoji;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleCommentReaction(comment, emoji)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 border ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Reaction Picker Trigger */}
                    <div className="relative group/picker">
                      <button className="text-slate-400 hover:text-indigo-600 transition flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">React</span>
                      </button>
                      
                      {/* Emoji Picker Popover */}
                      <div className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-xl border border-slate-100 p-1 flex gap-1 opacity-0 pointer-events-none group-hover/picker:opacity-100 group-hover/picker:pointer-events-auto transition-all transform translate-y-2 group-hover/picker:translate-y-0 z-10">
                        {COMMENT_REACTIONS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleCommentReaction(comment, emoji)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition transform hover:scale-125 text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-indigo-600 transition flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Reply</span>
                    </button>
                    
                    <button className="text-slate-400 hover:text-indigo-600 transition flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
                    </button>
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
