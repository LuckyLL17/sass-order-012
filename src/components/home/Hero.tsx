import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingDown, Clock } from 'lucide-react';

export default function Hero() {
  const highlights = [
    { icon: TrendingDown, text: '成本降低50%' },
    { icon: Clock, text: '即开即用' },
    { icon: Shield, text: '安全可靠' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern">
      <div className="absolute inset-0 bg-grid opacity-40" />
      
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-stagger">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8"
          >
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">
              全新上线 · 聚合100+优质SaaS工具
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">一站式订阅</span>
            <br />
            <span className="gradient-text bg-[length:200%_auto] animate-gradient">
              您所需的所有工具
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
            灵活订阅设计、开发、营销等各类在线工具，统一管理账单，
            团队协作更高效，帮助企业降低软件采购成本30%-50%。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/market" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              立即开始
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/#pricing" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto">
              查看定价方案
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-gray-300 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent pointer-events-none z-10 h-20" />
          <div className="card p-2 overflow-hidden">
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <img
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20saas%20dashboard%20dark%20theme%20analytics%20charts%20ui%20design&image_size=landscape_16_9"
                alt="平台预览"
                className="w-full h-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
