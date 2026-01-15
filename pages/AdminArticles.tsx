
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface AdminArticlesProps {
  articles: Article[];
  onDelete: (id: string) => void;
}

const AdminArticles: React.FC<AdminArticlesProps> = ({ articles, onDelete }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold serif text-slate-900">Manage Content</h1>
          <p className="text-slate-500">View and edit your published or scheduled stories.</p>
        </div>
        <Link to="/admin/new" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Write Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Title & Details</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Stats</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map(a => (
                <tr key={a.id} className="group hover:bg-slate-50 transition">
                  <td className="px-8 py-6">
                    <StatusTag status={a.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-md">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">{a.title}</p>
                      <p className="text-xs text-slate-400 mt-1">Author: {a.author} • {new Date(a.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{a.category}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold">
                        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                        {a.likes}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold">
                        <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {a.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/admin/edit/${a.id}`} className="p-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Link>
                      <button 
                        onClick={() => confirm('Delete article?') && onDelete(a.id)}
                        className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusTag = ({ status }: { status: Article['status'] }) => {
  const styles = {
    published: 'bg-emerald-100 text-emerald-700',
    scheduled: 'bg-orange-100 text-orange-700',
    draft: 'bg-slate-200 text-slate-600',
  };
  return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
};

export default AdminArticles;
