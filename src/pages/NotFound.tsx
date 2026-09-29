import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none gradient-text bg-[length:200%_auto] animate-gradient">
            404
          </h1>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          页面未找到
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          <Link to="/market" className="btn-outline w-full sm:w-auto">
            <Search className="w-5 h-5" />
            浏览工具
          </Link>
        </div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => window.history.back()}
          className="mt-6 text-gray-400 hover:text-white inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回上一页
        </motion.button>
      </motion.div>
    </div>
  );
}
