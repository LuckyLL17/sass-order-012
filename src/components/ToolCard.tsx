import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, ArrowRight, ThumbsDown, BadgeCheck } from 'lucide-react';
import type { Tool, ViewSource } from '@/types';
import { categories } from '@/mock/tools';
import { useTrackToolView } from '@/hooks/useTrackToolView';

interface ToolCardProps {
  tool: Tool;
  index?: number;
  /** 传入后自动记录首页/市场曝光或详情浏览，不传则不埋点（如相关工具） */
  trackSource?: ViewSource;
  /** 显示“已订阅”角标 */
  subscribed?: boolean;
  /** 传入后卡片右上角显示“不感兴趣”按钮 */
  onDislike?: (tool: Tool) => void;
}

export default function ToolCard({ tool, index = 0, trackSource, subscribed, onDislike }: ToolCardProps) {
  const categoryInfo = categories.find(c => c.id === tool.category);
  const trackRef = useTrackToolView(tool.id, trackSource ?? 'home', Boolean(trackSource));

  return (
    <motion.div
      ref={trackRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative h-full group/card"
    >
      <Link
        to={`/tool/${tool.id}`}
        className="card-hover block group h-full"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-dark-900 p-2 flex-shrink-0 overflow-hidden border border-gray-700/50">
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-primary-400 transition-colors">
              {tool.name}
            </h3>
            {categoryInfo && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${categoryInfo.color} text-white/90`}>
                {categoryInfo.name}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-dark-900 text-gray-400 text-xs border border-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span className="text-white font-medium">{tool.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(tool.usersCount / 1000).toFixed(0)}K+</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-primary-400 font-medium text-sm group-hover:gap-2 transition-all">
            查看详情
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs">起价</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  ¥{Math.min(...tool.plans.map(p => p.price))}
                </span>
                <span className="text-gray-500 text-sm">/月</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {subscribed ? '继续使用' : '立即订阅'}
            </div>
          </div>
        </div>
      </Link>

      {subscribed ? (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
          <BadgeCheck className="w-3.5 h-3.5" />
          已订阅
        </span>
      ) : (
        onDislike && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDislike(tool);
            }}
            title="不感兴趣，减少此类推荐"
            aria-label={`不感兴趣：${tool.name}`}
            className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-dark-900/90 text-gray-400 border border-gray-700 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-all"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            不感兴趣
          </button>
        )
      )}
    </motion.div>
  );
}
