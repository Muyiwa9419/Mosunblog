
import React from 'react';
import { Link } from 'react-router-dom';
import { Comment, Article } from '../types';

interface AdminCommentsProps {
  comments: Comment[];
  articles: Article[];
  onDelete: (id: string) => void;
}

const AdminComments: React.FC<AdminCommentsProps> = ({ comments, articles, onDelete }) => {
  const getArticleTitle = (id: string) => articles.find(a => a.id === id)?.title || 'Unknown Post';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex items-center gap-4">
        <Link to="/admin" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-3xl font-bold serif">Comment Moderation</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comments.map(comment => (
                <tr key={comment.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-8 h-8 rounded-full" alt="" />
                      <span className="font-bold text-slate-900 text-sm">{comment.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm text-slate-600 line-clamp-2 italic">"{comment.text}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/article/${comment.articleId}`} className="text-xs text-indigo-600 font-bold hover:underline">
                      {getArticleTitle(comment.articleId)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { if(confirm('Delete this comment?')) onDelete(comment.id) }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              No comments to moderate. All quiet on the front!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
