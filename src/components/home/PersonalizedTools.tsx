import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  Sparkles,
  Compass,
  ArrowRight,
  LogIn,
  ThumbsDown,
  Trash2,
  X,
  Check,
  LayoutGrid,
} from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { useStore } from '@/store/useStore';
import { buildRecommendations, type RecommendationItem } from '@/lib/recommendations';

interface SectionProps {
  id: string;
  icon: typeof History;
  title: string;
  subtitle: string;
  items: RecommendationItem[];
  onDismiss: (toolId: string) => void;
  empty: React.ReactNode;
}

function RecommendationSection({ id, icon: Icon, title, subtitle, items, onDismiss, empty }: SectionProps) {
  return (
    <div id={id} className="mb-14 last:mb-0">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <ToolCard
              key={item.tool.id}
              tool={item.tool}
              index={index}
              source="home"
              onDismiss={onDismiss}
            />
          ))}
        </div>
      ) : (
        empty
      )}
    </div>
  );
}

function EmptyHint({ icon: Icon, title, description, action }: {
  icon: typeof History;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card border-dashed text-center py-10 px-6">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-dark-900 flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-500" />
      </div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-gray-500 text-sm mb-5">{description}</p>
      {action}
    </div>
  );
}

const marketLink = (
  <Link to="/market" className="btn-outline w-fit mx-auto text-sm">
    <LayoutGrid className="w-4 h-4" />
    去市场逛逛
  </Link>
);

export default function PersonalizedTools() {
  const {
    tools,
    toolViews,
    dislikedToolIds,
    subscriptions,
    isAuthenticated,
    markToolDisliked,
    clearDislikedFeedback,
  } = useStore();

  const [confirmingClear, setConfirmingClear] = useState(false);

  const activeSubscribedToolIds = useMemo(
    () => subscriptions.filter(s => s.status === 'active').map(s => s.toolId),
    [subscriptions],
  );

  // 订阅变化、浏览变化、反馈变化都会自动重新计算
  const recs = useMemo(
    () => buildRecommendations({
      tools,
      views: toolViews,
      dislikedToolIds,
      activeSubscribedToolIds,
      isAuthenticated,
    }),
    [tools, toolViews, dislikedToolIds, activeSubscribedToolIds, isAuthenticated],
  );

  const hasAnyPersonalData = recs.hasHistory || dislikedToolIds.length > 0;

  return (
    <section className="py-24 bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-medium">个性化推荐</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              为你<span className="gradient-text">精选</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              根据你的浏览记录与有效订阅实时生成，结合分类与标签排序
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {dislikedToolIds.length > 0 && (
              confirmingClear ? (
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-900 border border-gray-700 text-sm">
                  <span className="text-gray-300">清除全部「不感兴趣」反馈？</span>
                  <button
                    onClick={() => {
                      clearDislikedFeedback();
                      setConfirmingClear(false);
                    }}
                    className="p-1 rounded text-green-400 hover:bg-green-500/10"
                    title="确认清除"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmingClear(false)}
                    className="p-1 rounded text-gray-400 hover:bg-white/10"
                    title="取消"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmingClear(true)}
                  className="btn-outline w-fit text-sm"
                  title={`已屏蔽 ${dislikedToolIds.length} 个工具，清除后将重新参与推荐`}
                >
                  <Trash2 className="w-4 h-4" />
                  清除反馈 ({dislikedToolIds.length})
                </button>
              )
            )}

            <Link to="/market" className="btn-outline w-fit">
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
            className="card mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-primary-500/20 bg-primary-500/5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">登录后获得更精准的推荐</p>
                <p className="text-gray-400 text-sm">
                  当前以游客身份浏览，「与订阅相似」需要登录并拥有有效订阅；登录后还会自动合并本机浏览记录
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/login" className="btn-primary text-sm">
                <LogIn className="w-4 h-4" />
                登录
              </Link>
              <Link to="/register" className="btn-outline text-sm">
                注册
              </Link>
            </div>
          </motion.div>
        )}

        {isAuthenticated && !hasAnyPersonalData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card mb-12 flex items-start gap-3 border-dashed"
          >
            <Compass className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-sm">
              我们正在学习你的偏好。浏览工具市场或查看工具详情后，「最近浏览」和「为你发现」会越来越贴合你的需求。
            </p>
          </motion.div>
        )}

        <RecommendationSection
          id="recent-tools"
          icon={History}
          title="最近浏览"
          subtitle={
            recs.recent.length > 0
              ? `继续查看你最近感兴趣的工具（共 ${toolViews.length} 条记录）`
              : '你浏览过的工具会出现在这里'
          }
          items={recs.recent}
          onDismiss={markToolDisliked}
          empty={
            <EmptyHint
              icon={History}
              title="还没有浏览记录"
              description="去工具市场看看，或点开任意工具详情，最近浏览的工具会展示在这里"
              action={marketLink}
            />
          }
        />

        <RecommendationSection
          id="similar-subscriptions"
          icon={Sparkles}
          title="与订阅相似"
          subtitle={
            !isAuthenticated
              ? '登录后基于你的有效订阅，按分类与标签匹配同类工具'
              : recs.hasActiveSubscriptions
                ? `基于 ${activeSubscribedToolIds.length} 个有效订阅，按分类与标签相似度排序`
                : '拥有有效订阅后，这里会推荐同类好工具'
          }
          items={recs.similar}
          onDismiss={markToolDisliked}
          empty={
            !isAuthenticated ? (
              <EmptyHint
                icon={LogIn}
                title="登录后解锁订阅相似推荐"
                description="登录后，我们会分析你有效订阅的分类与标签，推荐同类优质工具"
                action={
                  <Link to="/login" className="btn-primary w-fit mx-auto text-sm">
                    <LogIn className="w-4 h-4" />
                    立即登录
                  </Link>
                }
              />
            ) : (
              <EmptyHint
                icon={Sparkles}
                title="暂无有效订阅"
                description="订阅任意工具后，这里会按分类与标签为你推荐相似工具"
                action={marketLink}
              />
            )
          }
        />

        <RecommendationSection
          id="discover-tools"
          icon={Compass}
          title="为你发现"
          subtitle={
            recs.discover.some(item => !item.backfilled)
              ? '融合订阅与浏览兴趣，排除已订阅、已浏览及屏蔽内容'
              : '兴趣信号还不够，先为你发现高人气工具'
          }
          items={recs.discover}
          onDismiss={markToolDisliked}
          empty={
            <EmptyHint
              icon={ThumbsDown}
              title="暂无可推荐的工具"
              description="清除「不感兴趣」反馈后，将有更多工具重新参与推荐"
              action={
                dislikedToolIds.length > 0 ? (
                  <button onClick={clearDislikedFeedback} className="btn-outline w-fit mx-auto text-sm">
                    <Trash2 className="w-4 h-4" />
                    清除反馈
                  </button>
                ) : marketLink
              }
            />
          }
        />
      </div>
    </section>
  );
}
