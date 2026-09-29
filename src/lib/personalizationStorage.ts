import type { ToolView } from '@/types';

// 个性化数据（浏览记录 / 不感兴趣）以「游客」或「用户 ID」为维度隔离存储
const STORAGE_PREFIX = 'subhub:personalization:';
const GUEST_KEY = `${STORAGE_PREFIX}guest`;

export interface PersonalizationData {
  views: ToolView[];
  dislikedToolIds: string[];
}

export const MAX_VIEW_HISTORY = 30;

export function storageKeyFor(userId?: string | null): string {
  return userId ? `${STORAGE_PREFIX}${userId}` : GUEST_KEY;
}

export function loadPersonalization(userId?: string | null): PersonalizationData {
  const empty: PersonalizationData = { views: [], dislikedToolIds: [] };
  try {
    const raw = localStorage.getItem(storageKeyFor(userId));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<PersonalizationData>;
    return {
      views: Array.isArray(parsed.views) ? parsed.views : [],
      dislikedToolIds: Array.isArray(parsed.dislikedToolIds) ? parsed.dislikedToolIds : [],
    };
  } catch {
    // localStorage 不可用（隐私模式等）时退化为内存态
    return empty;
  }
}

export function savePersonalization(data: PersonalizationData, userId?: string | null): void {
  try {
    localStorage.setItem(storageKeyFor(userId), JSON.stringify(data));
  } catch {
    // 存储失败（配额已满 / 隐私模式）时静默降级，不影响内存中的推荐
  }
}

export function removePersonalization(userId?: string | null): void {
  try {
    localStorage.removeItem(storageKeyFor(userId));
  } catch {
    // ignore
  }
}

// 合并游客数据到登录用户数据：浏览记录按 toolId 聚合，去重并保留最近访问
export function mergePersonalization(
  guest: PersonalizationData,
  user: PersonalizationData,
): PersonalizationData {
  const viewMap = new Map<string, ToolView>();

  for (const view of user.views) {
    viewMap.set(view.toolId, { ...view });
  }
  for (const view of guest.views) {
    const existing = viewMap.get(view.toolId);
    if (existing) {
      viewMap.set(view.toolId, {
        ...existing,
        viewCount: existing.viewCount + view.viewCount,
        lastViewedAt: Math.max(existing.lastViewedAt, view.lastViewedAt),
        // 最近一次的来源更能反映当前意图
        source: view.lastViewedAt > existing.lastViewedAt ? view.source : existing.source,
      });
    } else {
      viewMap.set(view.toolId, { ...view });
    }
  }

  const views = Array.from(viewMap.values())
    .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
    .slice(0, MAX_VIEW_HISTORY);

  const dislikedToolIds = Array.from(new Set([
    ...user.dislikedToolIds,
    ...guest.dislikedToolIds,
  ]));

  return { views, dislikedToolIds };
}

// 记录一次浏览：同一工具按 toolId 聚合，重复挂载/StrictMode 下短时间内不重复计数
export function upsertToolView(
  views: ToolView[],
  toolId: string,
  source: ToolView['source'],
  now: number,
): ToolView[] {
  const existing = views.find(v => v.toolId === toolId);
  let nextViews: ToolView[];

  if (existing) {
    const isDuplicateMount = now - existing.lastViewedAt < 3000;
    nextViews = views.map(v =>
      v.toolId === toolId
        ? {
            ...v,
            source,
            lastViewedAt: now,
            viewCount: isDuplicateMount ? v.viewCount : v.viewCount + 1,
          }
        : v,
    );
  } else {
    nextViews = [...views, { toolId, source, viewCount: 1, lastViewedAt: now }];
  }

  return nextViews
    .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
    .slice(0, MAX_VIEW_HISTORY);
}
