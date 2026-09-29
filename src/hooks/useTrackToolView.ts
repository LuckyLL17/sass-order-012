import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import type { ViewSource } from '@/types';

/**
 * 记录工具浏览行为：
 * - source 为 'detail' 时，挂载即记录（详情页主动查看）
 * - source 为 'home' | 'market' 时，卡片滚动进入视口记录一次曝光
 *
 * store 内对同一来源的短时间重复挂载做了合并，因此可安全用于
 * React StrictMode 与卡片重新挂载场景。
 */
export function useTrackToolView(
  toolId: string | undefined,
  source: ViewSource,
  enabled: boolean = true,
) {
  const recordView = useStore((state) => state.recordView);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !toolId) return;

    if (source === 'detail') {
      recordView(toolId, 'detail');
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      recordView(toolId, source);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          recordView(toolId, source);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [toolId, source, enabled, recordView]);

  return ref;
}
