
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { CATEGORIES } from '../constants';

interface HomePageProps {
  articles: Article[];
}

const HomePage: React.FC<HomePageProps> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const visibleArticles = articles.filter(a => {
    const isPublished = a.status === 'published' && new Date(a.publishedAt).getTime() <= now;
    const isScheduledPast = a.status === 'scheduled' && a.scheduledAt && new Date(a.scheduledAt).getTime() <= now;
    
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return (isPublished || isScheduledPast) && matchesCategory;
  }).sort((a, b) => {
    const timeA = a.status === 'scheduled' ? new Date(a.scheduledAt!).getTime() : new Date(a.publishedAt).getTime();
    const timeB = b.status === 'scheduled' ? new Date(b.scheduledAt!).getTime() : new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  const featured = visibleArticles[0];
  const others = visibleArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
      {/* Categories Tabs - Moved up for cleaner focus on content */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 md:mb-16">
        {['All', ...CATEGORIES].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition border ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {featured && activeCategory === 'All' && (
        <section className="mb-12 md:mb-20">
          <Link to={`/article/${featured.id}`} className="group relative block overflow-hidden rounded-2xl md:rounded-3xl bg-slate-200 aspect-video md:aspect-[21/9] shadow-xl md:shadow-2xl">
            <img 
              src={featured.coverImage} 
              alt={featured.title} 
              className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-6 md:p-16">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-3 md:mb-6 tracking-widest uppercase">
                Featured Story • {featured.category}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-6 serif group-hover:text-indigo-300 transition leading-tight max-w-4xl">
                {featured.title}
              </h2>
              <div className="flex items-center text-slate-300 text-xs md:text-sm font-medium">
                <span className="text-white font-bold">{featured.author}</span>
                <span className="mx-2 md:mx-3 opacity-30">|</span>
                <span>{new Date(featured.status === 'scheduled' ? featured.scheduledAt! : featured.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Article Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {(activeCategory === 'All' ? others : visibleArticles).map(article => (
          <article key={article.id} className="flex flex-col group animate-in slide-in-from-bottom-2 duration-500">
            <Link to={`/article/${article.id}`} className="overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] mb-4 md:mb-6 block shadow-sm group-hover:shadow-lg transition-all duration-300 border border-slate-100">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Link to={`/category/${article.category.toLowerCase()}`} className="text-indigo-600 text-[10px] md:text-xs font-bold uppercase tracking-wider hover:underline">{article.category}</Link>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 text-[10px] md:text-xs">{new Date(article.status === 'scheduled' ? article.scheduledAt! : article.publishedAt).toLocaleDateString()}</span>
            </div>
            <Link to={`/article/${article.id}`} className="hover:text-indigo-600 transition">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 leading-tight serif">{article.title}</h3>
            </Link>
            <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4 md:pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                   <img src={`https://ui-avatars.com/api/?name=${article.author}&background=random`} alt={article.author} />
                 </div>
                 <span className="text-[10px] md:text-xs text-slate-700 font-bold truncate max-w-[80px] md:max-w-none">{article.author}</span>
               </div>
               <div className="flex items-center text-[10px] text-slate-400 font-bold gap-2 md:gap-3 uppercase tracking-widest">
                 <span className="flex items-center gap-1">
                   <svg className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                   {article.likes}
                 </span>
                 <span className="flex items-center gap-1">
                   <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   {article.rating}
                 </span>
               </div>
            </div>
          </article>
        ))}
      </section>

      {visibleArticles.length === 0 && (
        <div className="py-20 md:py-32 text-center text-slate-400">
          <p className="text-xl md:text-2xl serif px-4">No stories found matching your criteria.</p>
          <button onClick={() => setActiveCategory('All')} className="text-indigo-600 font-bold hover:underline mt-4">Show all articles</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
