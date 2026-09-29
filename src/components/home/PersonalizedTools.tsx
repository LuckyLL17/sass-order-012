import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  History,
  Layers,
  Compass,
  Trash2,
  Undo2,
  LogIn,
  ThumbsDown,
} from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { useStore } from '@/store/useStore';
import { buildRecommendations } from '@/lib/recommendations';
import { tools as allTools } from '@/mock/tools';
import type { RecommendationSection, Tool } from '@/types';

const SECTION_META = {
  recent: { icon: History, accent: 'text-cyan-400', label: '浏览记录' },
  similar: { icon: Layers, accent: 'text-primary-400', label: '相似推荐' },
  discover: { icon: Compass, accent: 'text-gold-400', label: '个性精选' },
} as const;

const UNDO_DURATION = 5000;

function SectionGrid({
  section,
  activeToolIds,
  onDislike,
}: {
  section: RecommendationSection;
  activeToolIds: Set<string>;
  onDislike: (tool: Tool) => void;
}) {
  const meta = SECTION_META[section.key];
  const Icon = meta.icon;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${meta.accent}`} />
            <span className={`${meta.accent} font-medium text-sm`}>{meta.label}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{section.subtitle}</p>
        </div>
      </div>

      {section.tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.tools.map((tool, index) => (
            <ToolCard
              key={`${section.key}-${tool.id}`}
              tool={tool}
              index={index}
              trackSource="home"
              subscribed={activeToolIds.has(tool.id)}
              onDislike={section.key === 'recent' ? undefined : onDislike}
            />
          ))}
        </div>
      ) : (
        <div className="card border-dashed py-10 text-center">
          <p className="text-gray-400 text-sm">暂无符合的工具，去市场逛逛更多选择吧</p>
          <Link to="/market" className="btn-outline mt-4">
            浏览工具市场
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PersonalizedTools() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const subscriptions = useStore((state) => state.subscriptions);
  const toolViews = useStore((state) => state.toolViews);
  const dislikedToolIds = useStore((state) => state.dislikedToolIds);
  const clearViews = useStore((state) => state.clearViews);
  const clearFeedback = useStore((state) => state.clearFeedback);
  const markDisliked = useStore((state) => state.markDisliked);
  const undoDislike = useStore((state) => state.undoDislike);

  // 订阅、浏览记录或反馈变化时实时重算三个分区
  const sections = useMemo(
    () =>
      buildRecommendations({
        tools: allTools,
        views: toolViews,
        subscriptions,
        dislikedToolIds,
      }),
    [toolViews, dislikedToolIds, subscriptions],
  );

  const activeToolIds = useMemo(
    () => new Set(subscriptions.filter((sub) => sub.status === 'active').map((sub) => sub.toolId)),
    [subscriptions],
  );

  const hasActiveSubscription = activeToolIds.size > 0;
  const hasViews = toolViews.length > 0;

  const [undoTool, setUndoTool] = useState<Tool | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  const handleDislike = (tool: Tool) => {
    markDisliked(tool.id);
    setUndoTool(tool);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoTool(null), UNDO_DURATION);
  };

  const handleUndo = () => {
    if (undoTool) undoDislike(undoTool.id);
    setUndoTool(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const recentSection = sections.find((s) => s.key === 'recent');
  const similarSection = sections.find((s) => s.key === 'similar');
  const discoverSection = sections.find((s) => s.key === 'discover');

  return (
    <section className="py-24 bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-medium">个性化推荐</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              为你<span className="gradient-text">精选</span>
            </h2>
            <p className="text-gray-400 mt-3">
              根据您的浏览记录与订阅偏好实时生成
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasViews && (
              <button
                onClick={clearViews}
                className="btn-outline !py-2 !px-4 text-sm"
                title="清除全部浏览记录"
              >
                <Trash2 className="w-4 h-4" />
                清除浏览
              </button>
            )}
            {dislikedToolIds.length > 0 && (
              <button
                onClick={clearFeedback}
                className="btn-outline !py-2 !px-4 text-sm"
                title="恢复所有标记为不感兴趣的工具"
              >
                <Undo2 className="w-4 h-4" />
                清除反馈（{dislikedToolIds.length}）
              </button>
            )}
            <Link to="/market" className="btn-outline !py-2 !px-4 text-sm">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card border-primary-500/30 bg-primary-500/5 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 !py-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">登录后获得更精准的推荐</p>
                <p className="text-gray-400 text-sm mt-0.5">
                  当前以游客身份浏览，我们会在本机临时记录您的偏好
                </p>
              </div>
            </div>
            <Link to="/login" className="btn-primary !py-2.5 !px-5 text-sm whitespace-nowrap">
              登录 / 注册
            </Link>
          </motion.div>
        )}

        <div className="space-y-16">
          {recentSection && recentSection.tools.length > 0 && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <History className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-400 font-medium text-sm">浏览记录</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">最近浏览</h3>
                  <p className="text-gray-400 text-sm mt-1">继续查看您之前关注的工具</p>
                </div>
                <button
                  onClick={clearViews}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  清空记录
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentSection.tools.map((tool, index) => (
                  <ToolCard
                    key={`recent-${tool.id}`}
                    tool={tool}
                    index={index}
                    trackSource="home"
                    subscribed={activeToolIds.has(tool.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {hasActiveSubscription && similarSection && similarSection.tools.length > 0 && (
            <motion.div
              key="similar"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionGrid section={similarSection} activeToolIds={activeToolIds} onDislike={handleDislike} />
            </motion.div>
          )}

          {discoverSection && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionGrid section={discoverSection} activeToolIds={activeToolIds} onDislike={handleDislike} />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {undoTool && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass border-gray-700 rounded-xl shadow-card-hover px-4 py-3 flex items-center gap-3">
              <ThumbsDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-200">
                将减少为您推荐「{undoTool.name}」
              </span>
              <button
                onClick={handleUndo}
                className="text-sm font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1 flex-shrink-0"
              >
                <Undo2 className="w-4 h-4" />
                撤销
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
