import type { Tool, ToolView, Category } from '@/types';
import { categories } from '@/mock/tools';

export const SECTION_SIZE = 4;

export interface RecommendationItem {
  tool: Tool;
  reason: string;
  /** 候选不足时用热度兜底补位 */
  backfilled?: boolean;
}

export interface PersonalizedRecommendations {
  recent: RecommendationItem[];
  similar: RecommendationItem[];
  discover: RecommendationItem[];
  hasHistory: boolean;
  hasActiveSubscriptions: boolean;
}

interface BuildParams {
  tools: Tool[];
  views: ToolView[];
  dislikedToolIds: string[];
  activeSubscribedToolIds: string[];
  isAuthenticated: boolean;
}

const categoryName = (id: Category) => categories.find(c => c.id === id)?.name ?? '';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚浏览';
  if (minutes < 60) return `${minutes} 分钟前浏览`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前浏览`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前浏览`;
  return '最近浏览';
}

/** 浏览行为的时间衰减权重，越近的浏览越能代表当前兴趣 */
function recencyWeight(ts: number): number {
  const ageDays = (Date.now() - ts) / (24 * 60 * 60 * 1000);
  return Math.exp(-ageDays / 14);
}

interface Affinity {
  categories: Map<Category, number>;
  tags: Map<string, number>;
}

function buildAffinity(tools: ToolView[], allTools: Tool[], fromSubscriptions: string[]): Affinity {
  const byId = new Map(allTools.map(t => [t.id, t]));
  const categoryScores = new Map<Category, number>();
  const tagScores = new Map<string, number>();

  const add = (tool: Tool, weight: number) => {
    categoryScores.set(tool.category, (categoryScores.get(tool.category) ?? 0) + weight);
    tool.tags.forEach(tag => tagScores.set(tag, (tagScores.get(tag) ?? 0) + weight));
  };

  // 有效订阅是最强的兴趣信号
  fromSubscriptions.forEach(id => {
    const tool = byId.get(id);
    if (tool) add(tool, 3);
  });

  // 其次是近期、多次的浏览
  tools.forEach(view => {
    const tool = byId.get(view.toolId);
    if (!tool) return;
    const sourceWeight = view.source === 'detail' ? 1.5 : view.source === 'market' ? 1 : 0.6;
    add(tool, sourceWeight * recencyWeight(view.lastViewedAt) * (1 + Math.log1p(view.viewCount)));
  });

  return { categories: categoryScores, tags: tagScores };
}

function affinityForTool(tool: Tool, affinity: Affinity): number {
  const categoryScore = affinity.categories.get(tool.category) ?? 0;
  const tagScore = tool.tags.reduce((sum, tag) => sum + (affinity.tags.get(tag) ?? 0), 0);
  return categoryScore * 2 + tagScore;
}

function topSignals(tool: Tool, affinity: Affinity): { category: boolean; tags: string[] } {
  const matchedTags = tool.tags
    .filter(tag => (affinity.tags.get(tag) ?? 0) > 0)
    .sort((a, b) => (affinity.tags.get(b) ?? 0) - (affinity.tags.get(a) ?? 0));
  return {
    category: (affinity.categories.get(tool.category) ?? 0) > 0,
    tags: matchedTags.slice(0, 2),
  };
}

export function buildRecommendations(params: BuildParams): PersonalizedRecommendations {
  const { tools: allTools, views, dislikedToolIds, activeSubscribedToolIds, isAuthenticated } = params;

  const disliked = new Set(dislikedToolIds);
  const subscribed = new Set(activeSubscribedToolIds);
  const byId = new Map(allTools.map(t => [t.id, t]));

  // 热度归一化，用于打分兜底
  const maxUsers = Math.max(...allTools.map(t => t.usersCount), 1);
  const popularity = (tool: Tool) =>
    tool.usersCount / maxUsers * 50 + tool.rating * 5;

  // ---------- 1. 最近浏览：按时间倒序，过滤已标记不感兴趣与失效工具 ----------
  const recentViews = [...views].sort((a, b) => b.lastViewedAt - a.lastViewedAt);

  const recent: RecommendationItem[] = [];
  for (const view of recentViews) {
    if (recent.length >= SECTION_SIZE) break;
    const tool = byId.get(view.toolId);
    if (!tool || disliked.has(tool.id)) continue;
    recent.push({ tool, reason: timeAgo(view.lastViewedAt) });
  }
  const recentIds = new Set(recent.map(r => r.tool.id));

  // ---------- 2. 与订阅相似：基于有效订阅的分类/标签画像 ----------
  const similar: RecommendationItem[] = [];
  const subscriptionAffinity = buildAffinity([], allTools, activeSubscribedToolIds);

  let similarCandidates: RecommendationItem[] = [];
  if (isAuthenticated && activeSubscribedToolIds.length > 0) {
    similarCandidates = allTools
      .filter(tool => !subscribed.has(tool.id) && !disliked.has(tool.id) && !recentIds.has(tool.id))
      .map(tool => {
        const score = affinityForTool(tool, subscriptionAffinity);
        const signals = topSignals(tool, subscriptionAffinity);
        let reason: string;
        if (signals.tags.length > 0) {
          reason = `与订阅工具同样关注「${signals.tags.join('、')}」`;
        } else if (signals.category) {
          reason = `来自你常订阅的${categoryName(tool.category)}分类`;
        } else {
          reason = '猜你可能喜欢';
        }
        return { tool, score, reason };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || b.tool.rating - a.tool.rating || b.tool.usersCount - a.tool.usersCount)
      .map(({ tool, reason }) => ({ tool, reason }));
  }

  similar.push(...similarCandidates.slice(0, SECTION_SIZE));

  // 结果不足：用未订阅、未排除的热门工具兜底
  if (similar.length < SECTION_SIZE && isAuthenticated && activeSubscribedToolIds.length > 0) {
    const usedIds = new Set([
      ...recentIds,
      ...similar.map(s => s.tool.id),
      ...subscribed,
      ...disliked,
    ]);
    const backfill = allTools
      .filter(tool => !usedIds.has(tool.id))
      .sort((a, b) => b.usersCount - a.usersCount)
      .slice(0, SECTION_SIZE - similar.length)
      .map(tool => ({ tool, reason: '热门工具推荐', backfilled: true }));
    similar.push(...backfill);
  }
  const similarIds = new Set(similar.map(s => s.tool.id));

  // ---------- 3. 为你发现：融合订阅 + 浏览兴趣，排除已订阅/已浏览/不感兴趣 ----------
  const discover: RecommendationItem[] = [];
  const discoverAffinity = buildAffinity(views, allTools, isAuthenticated ? activeSubscribedToolIds : []);

  const excludeDiscover = new Set([...recentIds, ...similarIds, ...subscribed, ...disliked]);
  const discoverCandidates = allTools
    .filter(tool => !excludeDiscover.has(tool.id))
    .map(tool => {
      const affinityScore = affinityForTool(tool, discoverAffinity);
      const score = affinityScore + popularity(tool) * 0.3;
      const signals = topSignals(tool, discoverAffinity);
      let reason: string;
      if (affinityScore > 0 && signals.tags.length > 0) {
        reason = `根据你的浏览，发现「${signals.tags[0]}」相关好工具`;
      } else if (affinityScore > 0 && signals.category) {
        reason = `发现你可能感兴趣的${categoryName(tool.category)}`;
      } else {
        reason = '高人气工具，值得一试';
      }
      return { tool, score, reason, matched: affinityScore > 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, SECTION_SIZE)
    .map(({ tool, reason, matched }) => ({ tool, reason, backfilled: !matched }));

  discover.push(...discoverCandidates);

  // 结果不足（理论上工具总量足够，这里做防御性兜底）
  if (discover.length < SECTION_SIZE) {
    const usedIds = new Set([
      ...recentIds,
      ...similarIds,
      ...new Set(discover.map(d => d.tool.id)),
      ...subscribed,
      ...disliked,
    ]);
    allTools
      .filter(tool => !usedIds.has(tool.id))
      .sort((a, b) => b.usersCount - a.usersCount)
      .slice(0, SECTION_SIZE - discover.length)
      .forEach(tool => discover.push({ tool, reason: '热门工具推荐', backfilled: true }));
  }

  return {
    recent,
    similar,
    discover,
    hasHistory: views.length > 0,
    hasActiveSubscriptions: activeSubscribedToolIds.length > 0,
  };
}
