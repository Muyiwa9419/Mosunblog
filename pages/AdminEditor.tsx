
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../types';
import { CATEGORIES } from '../constants';
import { generateContentAdvice } from '../services/geminiService';

interface AdminEditorProps {
  articles: Article[];
  onSave: (article: Article) => void;
}

const AdminEditor: React.FC<AdminEditorProps> = ({ articles, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const existing = articles.find(a => a.id === id);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    category: CATEGORIES[0],
    coverImage: 'https://picsum.photos/seed/newpost/1200/600',
    status: 'draft',
    scheduledAt: null,
    author: 'Admin User'
  });

  const [aiInsight, setAiInsight] = useState<{ summary: string, tags: string[], improvementTip: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (existing) setFormData(existing);
  }, [existing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) return alert('Title and Content are required!');
    
    const finalArticle: Article = {
      id: existing?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title!,
      excerpt: formData.excerpt || formData.content!.substring(0, 150) + '...',
      content: formData.content!,
      category: formData.category!,
      coverImage: formData.coverImage!,
      author: formData.author!,
      status: formData.status as any,
      publishedAt: formData.status === 'published' ? new Date().toISOString() : (existing?.publishedAt || new Date().toISOString()),
      scheduledAt: formData.status === 'scheduled' ? formData.scheduledAt : null,
      likes: existing?.likes || 0,
      dislikes: existing?.dislikes || 0,
      rating: existing?.rating || 0,
      ratingCount: existing?.ratingCount || 0
    };

    onSave(finalArticle);
    navigate('/admin');
  };

  const runAiAssistant = async () => {
    if (!formData.title || !formData.content) return alert('Add content first!');
    setLoadingAi(true);
    const result = await generateContentAdvice(formData.title, formData.content);
    setAiInsight(result);
    setLoadingAi(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-3xl font-bold serif">{id ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={runAiAssistant} 
            disabled={loadingAi}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 font-bold px-6 py-2 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
          >
            {loadingAi ? 'AI Thinking...' : '✨ AI Assistant'}
          </button>
          <button onClick={handleSave} className="bg-slate-900 text-white font-bold px-8 py-2 rounded-lg hover:bg-indigo-600 transition">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="Enter a compelling title..." 
                  className="w-full text-2xl font-bold border-none bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Content</label>
                <textarea 
                  name="content"
                  value={formData.content} 
                  onChange={handleChange}
                  placeholder="Write your story..." 
                  className="w-full min-h-[400px] border-none bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-y placeholder:text-slate-300 leading-relaxed text-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Excerpt</label>
                <textarea 
                  name="excerpt"
                  value={formData.excerpt} 
                  onChange={handleChange}
                  placeholder="A short summary for the homepage list..." 
                  className="w-full min-h-[100px] border-none bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-300" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Insights Card */}
          {aiInsight && (
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> AI Insights
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-indigo-300 uppercase text-[10px]">Summary Suggestion</p>
                  <p className="leading-relaxed opacity-90 mt-1">{aiInsight.summary}</p>
                </div>
                <div>
                  <p className="font-bold text-indigo-300 uppercase text-[10px]">Improvement Tip</p>
                  <p className="leading-relaxed opacity-90 mt-1">{aiInsight.improvementTip}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.tags.map(tag => (
                    <span key={tag} className="bg-indigo-800 px-2 py-1 rounded text-[10px] font-bold">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg mb-2">Publishing Options</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Status</label>
              <select 
                name="status"
                value={formData.status} 
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Publish Now</option>
                <option value="scheduled">Schedule Post</option>
              </select>
            </div>

            {formData.status === 'scheduled' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Schedule Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="scheduledAt"
                  value={formData.scheduledAt || ''} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Category</label>
              <select 
                name="category"
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Banner Image</label>
              <div className="space-y-3">
                <div 
                  onClick={triggerFileInput}
                  className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition group"
                >
                  <svg className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Click to Upload Image</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold">
                    <span className="bg-white px-2 text-slate-300">Or Paste URL</span>
                  </div>
                </div>

                <input 
                  type="text" 
                  name="coverImage"
                  value={formData.coverImage} 
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
                />
              </div>
              {formData.coverImage && (
                <div className="mt-4 animate-in fade-in">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Preview</p>
                  <img src={formData.coverImage} alt="Preview" className="w-full rounded-lg aspect-video object-cover shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
