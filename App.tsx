
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Article, Comment } from './types';
import { INITIAL_ARTICLES, INITIAL_COMMENTS } from './constants';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditor from './pages/AdminEditor';
import AdminArticles from './pages/AdminArticles';
import AdminComments from './pages/AdminComments';
import AdminLoginPage from './pages/AdminLoginPage';

// Helper component for protected routes
// Fixed: Making children optional in the type definition to resolve TypeScript "missing children" errors during JSX instantiation.
const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean, children?: React.ReactNode }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('lumina_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('lumina_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('lumina_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('lumina_comments', JSON.stringify(comments));
  }, [comments]);

  const login = (password: string) => {
    if (password === 'Godpassage') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const upsertArticle = (article: Article) => {
    setArticles(prev => {
      const exists = prev.find(a => a.id === article.id);
      if (exists) return prev.map(a => a.id === article.id ? article : a);
      return [article, ...prev];
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    setComments(prev => prev.filter(c => c.articleId !== id));
  };

  const addComment = (comment: Comment) => setComments(prev => [comment, ...prev]);
  const deleteComment = (id: string) => setComments(prev => prev.filter(c => c.id !== id));
  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage articles={articles} />} />
          <Route path="/article/:id" element={<ArticlePage articles={articles} comments={comments} onCommentAdd={addComment} onArticleUpdate={updateArticle} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/category/:category" element={<CategoryPage articles={articles} />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage onLogin={login} isAuthenticated={isAuthenticated} />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard articles={articles} comments={comments} />} />
          <Route path="articles" element={<AdminArticles articles={articles} onDelete={deleteArticle} />} />
          <Route path="new" element={<AdminEditor articles={articles} onSave={upsertArticle} />} />
          <Route path="edit/:id" element={<AdminEditor articles={articles} onSave={upsertArticle} />} />
          <Route path="comments" element={<AdminComments comments={comments} articles={articles} onDelete={deleteComment} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
