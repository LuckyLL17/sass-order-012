import type { Category, RecommendationSection, Tool, ToolView, UserSubscription } from '@/types';

/** 每个分区展示的卡片数量 */
export const SECTION_LIMIT = 4;
/** 浏览兴趣画像最多回看的记录条数 */
const AFFINITY_VIEW_LIMIT = 50;
/** 各来源对兴趣画像的权重：详情查看 > 市场曝光 > 首页曝光 */
const VIEW_SOURCE_WEIGHT: Record<ToolView['source'], number> = {
  detail: 3,
  market: 2,
  home: 1,
};

export interface RecommendationInput {
  tools: Tool[];
  /** 按时间正序（旧 → 新） */
  views: ToolView[];
  /** 当前全部订阅，仅 status === 'active' 视为有效订阅 */
  subscriptions: UserSubscription[];
  /** 用户标记“不感兴趣”的工具 id */
  dislikedToolIds: string[];
}

const isActive = (sub: UserSubscription) => sub.status === 'active';

/** 时间衰减：越近的浏览权重越高，14 天半衰期 */
function recencyWeight(timestamp: number, now: number): number {
  const HALF_LIFE = 14 * 24 * 60 * 60 * 1000;
  const days = Math.max(0, now - timestamp) / HALF_LIFE;
  return Math.pow(0.5, days);
}

interface Affinity {
  categories: Map<Category, number>;
  tags: Map<string, number>;
}

/** 基于浏览历史构建分类/标签兴趣画像 */
function buildAffinity(tools: Tool[], views: ToolView[], now: number): Affinity {
  const toolById = new Map(tools.map((tool) => [tool.id, tool]));
  const categories = new Map<Category, number>();
  const tags = new Map<string, number>();

  views.slice(-AFFINITY_VIEW_LIMIT).forEach((view) => {
    const tool = toolById.get(view.toolId);
    if (!tool) return;
    const weight = VIEW_SOURCE_WEIGHT[view.source] * recencyWeight(view.timestamp, now);
    categories.set(tool.category, (categories.get(tool.category) ?? 0) + weight);
    tool.tags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + weight));
  });

  return { categories, tags };
}

const popularityOf = (tool: Tool, maxUsers: number) => tool.usersCount / maxUsers;

/**
 * 生成首页三个个性化推荐分区：
 * 1. 最近浏览：详情页最近查看过的工具
 * 2. 与订阅相似：与有效订阅同分类/同标签、尚未订阅的工具
 * 3. 为你发现：结合浏览兴趣画像打分，不足时用热门工具回填
 *
 * 分区之间去重，不感兴趣的工具不进入任何分区。
 */
export function buildRecommendations(input: RecommendationInput): RecommendationSection[] {
  const { tools, views, subscriptions, dislikedToolIds } = input;
  const now = Date.now();

  const activeSubs = subscriptions.filter(isActive);
  const activeToolIds = new Set(activeSubs.map((sub) => sub.toolId));
  const disliked = new Set(dislikedToolIds);
  const toolById = new Map(tools.map((tool) => [tool.id, tool]));

  const maxUsers = Math.max(1, ...tools.map((tool) => tool.usersCount));
  const affinity = buildAffinity(tools, views, now);
  const maxCategoryAffinity = Math.max(1, ...affinity.categories.values());
  const maxTagAffinity = Math.max(1, ...affinity.tags.values());

  // —— 分区一：最近浏览（仅取详情页查看，按时间倒序）——
  const recentToolIds: string[] = [];
  for (let i = views.length - 1; i >= 0; i--) {
    const view = views[i];
    if (view.source !== 'detail') continue;
    if (disliked.has(view.toolId)) continue;
    if (!toolById.has(view.toolId)) continue;
    if (!recentToolIds.includes(view.toolId)) recentToolIds.push(view.toolId);
    if (recentToolIds.length >= SECTION_LIMIT) break;
  }
  const recentTools = recentToolIds.map((id) => toolById.get(id)!).filter(Boolean);

  // —— 分区二：与订阅相似（参照有效订阅的分类与标签）——
  const usedIds = new Set(recentToolIds);
  const subscribedTools = activeSubs
    .map((sub) => toolById.get(sub.toolId))
    .filter((tool): tool is Tool => Boolean(tool));
  const subscribedCategories = new Set(subscribedTools.map((tool) => tool.category));
  const subscribedTagCounts = new Map<string, number>();
  subscribedTools.forEach((tool) => {
    tool.tags.forEach((tag) => subscribedTagCounts.set(tag, (subscribedTagCounts.get(tag) ?? 0) + 1));
  });
  const maxSubTagCount = Math.max(1, ...subscribedTagCounts.values());

  const similarTools =
    subscribedTools.length === 0
      ? []
      : tools
          .filter(
            (tool) =>
              !activeToolIds.has(tool.id) &&
              !disliked.has(tool.id) &&
              !usedIds.has(tool.id) &&
              (subscribedCategories.has(tool.category) ||
                tool.tags.some((tag) => subscribedTagCounts.has(tag))),
          )
          .map((tool) => {
            const categoryScore = subscribedCategories.has(tool.category) ? 2 : 0;
            const tagScore = tool.tags.reduce(
              (sum, tag) => sum + (subscribedTagCounts.get(tag) ?? 0) / maxSubTagCount,
              0,
            );
            const score =
              categoryScore +
              tagScore * 2 +
              popularityOf(tool, maxUsers) * 0.6 +
              (tool.rating - 4) * 0.4;
            return { tool, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, SECTION_LIMIT)
          .map(({ tool }) => tool);
  similarTools.forEach((tool) => usedIds.add(tool.id));

  // —— 分区三：为你发现（浏览兴趣画像打分 + 热门回填）——
  const viewedIds = new Set(views.map((view) => view.toolId));
  const scoredDiscover = tools
    .filter(
      (tool) =>
        !activeToolIds.has(tool.id) &&
        !disliked.has(tool.id) &&
        !usedIds.has(tool.id),
    )
    .map((tool) => {
      const categoryAffinity = (affinity.categories.get(tool.category) ?? 0) / maxCategoryAffinity;
      const tagAffinity =
        tool.tags.reduce((sum, tag) => sum + (affinity.tags.get(tag) ?? 0), 0) /
        (maxTagAffinity * 1.5);
      const score =
        categoryAffinity * 3 +
        Math.min(1, tagAffinity) * 2.5 +
        popularityOf(tool, maxUsers) * 1.2 +
        (tool.rating - 4) * 0.5 +
        // 已浏览但未订阅的降低权重，把新内容往前排
        (viewedIds.has(tool.id) ? -0.3 : 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score);

  const discoverTools = scoredDiscover.slice(0, SECTION_LIMIT).map(({ tool }) => tool);
  // 已入选的也要登记，避免热度回填时与打分入选的工具重复
  discoverTools.forEach((tool) => usedIds.add(tool.id));

  // 结果不足：用热门工具回填（同样排除已订阅/不感兴趣/已出现）
  if (discoverTools.length < SECTION_LIMIT) {
    const backfill = tools
      .filter(
        (tool) =>
          !activeToolIds.has(tool.id) &&
          !disliked.has(tool.id) &&
          !usedIds.has(tool.id),
      )
      .sort((a, b) => b.usersCount - a.usersCount);
    for (const tool of backfill) {
      if (discoverTools.length >= SECTION_LIMIT) break;
      discoverTools.push(tool);
      usedIds.add(tool.id);
    }
  }

  return [
    {
      key: 'recent',
      title: '最近浏览',
      subtitle: '继续查看您之前关注的工具',
      tools: recentTools,
    },
    {
      key: 'similar',
      title: '与订阅相似',
      subtitle:
        subscribedTools.length > 0
          ? `根据您正在使用的 ${subscribedTools.length} 款工具推荐`
          : '订阅工具后，这里会推荐同类好工具',
      tools: similarTools,
    },
    {
      key: 'discover',
      title: '为你发现',
      subtitle:
        views.length > 0 ? '结合您的浏览偏好与分类标签精选' : '先来看看大家都在用的热门工具',
      tools: discoverTools,
    },
  ];
}
