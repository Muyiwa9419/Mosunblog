
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article } from '../types';

interface CategoryPageProps {
  articles: Article[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ articles }) => {
  const { category } = useParams();
  
  const filtered = articles.filter(a => 
    a.category.toLowerCase() === category?.toLowerCase() && 
    a.status === 'published' &&
    new Date(a.publishedAt).getTime() <= Date.now()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-b border-slate-200 pb-8">
        <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2 block">Category</span>
        <h1 className="text-5xl font-bold serif capitalize">{category}</h1>
        <p className="text-slate-500 mt-4">Exploring the latest stories and insights in {category}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(article => (
          <article key={article.id} className="flex flex-col group">
            <Link to={`/article/${article.id}`} className="overflow-hidden rounded-xl bg-slate-200 aspect-video mb-4 block shadow-sm">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <Link to={`/article/${article.id}`} className="hover:text-indigo-600 transition">
              <h3 className="text-xl font-bold mb-3 leading-tight serif">{article.title}</h3>
            </Link>
            <p className="text-slate-600 text-sm line-clamp-3 mb-4">{article.excerpt}</p>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <p className="text-xl">No stories found in this category yet.</p>
            <Link to="/" className="text-indigo-600 font-bold hover:underline mt-4 block">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
