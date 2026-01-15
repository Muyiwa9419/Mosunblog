
import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Comment } from '../types';

interface AdminDashboardProps {
  articles: Article[];
  comments: Comment[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ articles, comments }) => {
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const scheduledCount = articles.filter(a => a.status === 'scheduled').length;
  const recentArticles = articles.slice(0, 5);
  const recentComments = comments.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold serif text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back. Here is what's happening with Lumina Press today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatTile label="Active Articles" value={publishedCount} sub="Total across 5 categories" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" color="indigo" />
        <StatTile label="Total Comments" value={comments.length} sub="From various readers" icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" color="emerald" />
        <StatTile label="Upcoming Posts" value={scheduledCount} sub="Waiting in queue" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="orange" />
        <StatTile label="Engagement" value="94%" sub="+12% from last week" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Recent Articles</h2>
            <Link to="/admin/articles" className="text-indigo-600 text-xs font-bold uppercase hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentArticles.map(a => (
              <div key={a.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={a.coverImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm line-clamp-1">{a.title}</p>
                    <p className="text-xs text-slate-400 capitalize">{a.category} • {a.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{a.likes} Likes</p>
                  <p className="text-[10px] text-slate-400">{new Date(a.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Recent Activity</h2>
            <Link to="/admin/comments" className="text-indigo-600 text-xs font-bold uppercase hover:underline">Review</Link>
          </div>
          <div className="p-6 space-y-6">
            {recentComments.map(c => (
              <div key={c.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-500">{c.author[0]}</span>
                </div>
                <div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    <span className="font-bold text-slate-900">{c.author}</span> commented on an article.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentComments.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatTile = ({ label, value, sub, icon, color }: any) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };
  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]} transition hover:shadow-lg hover:shadow-slate-100`}>
      <div className="flex items-center justify-between mb-4">
        <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <p className="text-slate-600 font-medium text-xs mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</span>
      </div>
      <p className="text-slate-400 text-[10px] mt-2 font-medium">{sub}</p>
    </div>
  );
};

export default AdminDashboard;
