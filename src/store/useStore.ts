import { create } from 'zustand';
import type { User, UserSubscription, Tool, Category, SortOption, SubscriptionFilter, UsersRange, ViewSource, RecommendationSection, ToolView } from '@/types';
import { userSubscriptions } from '@/mock/subscriptions';
import { tools } from '@/mock/tools';
import { buildRecommendations } from '@/lib/recommendations';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  subscriptionReminders: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface Store {
  user: User | null;
  subscriptions: UserSubscription[];
  tools: Tool[];
  selectedCategory: Category | 'all';
  searchQuery: string;
  sortBy: SortOption;
  priceMin: number;
  priceMax: number;
  ratingMin: number;
  ratingMax: number;
  usersRange: UsersRange;
  selectedTags: string[];
  subscriptionFilter: SubscriptionFilter;
  isAuthenticated: boolean;
  notificationSettings: NotificationSettings;
  userPassword: string;
  
  setUser: (user: User | null) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setPriceRange: (min: number, max: number) => void;
  setRatingRange: (min: number, max: number) => void;
  setUsersRange: (range: UsersRange) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSubscriptionFilter: (filter: SubscriptionFilter) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  addSubscription: (subscription: UserSubscription) => void;
  cancelSubscription: (id: string) => void;
  renewSubscription: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  downloadInvoice: (id: string) => void;
  getFilteredTools: () => Tool[];
  clearAllFilters: () => void;
  getAllTags: () => string[];
  getPriceRange: () => { min: number; max: number };

  // 个性化推荐相关
  toolViews: ToolView[];
  dislikedToolIds: string[];
  recordView: (toolId: string, source: ViewSource) => void;
  clearViews: () => void;
  markDisliked: (toolId: string) => void;
  undoDislike: (toolId: string) => void;
  clearFeedback: () => void;
  getRecommendations: () => RecommendationSection[];
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  subscriptionReminders: true,
  marketingEmails: false,
  securityAlerts: true,
};

// —— 个性化数据的 localStorage 持久化（设备级，未登录也会保留浏览记录）——
const VIEWS_STORAGE_KEY = 'subhub:tool-views';
const DISLIKED_STORAGE_KEY = 'subhub:disliked-tools';
const MAX_VIEW_RECORDS = 200;
/** 同一页面同一工具的重复曝光合并窗口，兼容 StrictMode 重复挂载 */
const VIEW_DEDUP_WINDOW = 30 * 1000;

function loadPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 隐私模式或存储已满时静默降级，不影响推荐功能
  }
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  subscriptions: userSubscriptions,
  tools: tools,
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',
  priceMin: 0,
  priceMax: 1000,
  ratingMin: 0,
  ratingMax: 5,
  usersRange: 'all',
  selectedTags: [],
  subscriptionFilter: 'all',
  isAuthenticated: false,
  notificationSettings: defaultNotificationSettings,
  userPassword: '',
  toolViews: loadPersisted<ToolView[]>(VIEWS_STORAGE_KEY, []),
  dislikedToolIds: loadPersisted<string[]>(DISLIKED_STORAGE_KEY, []),

  setUser: (user) => set({ user }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  
  setRatingRange: (min, max) => set({ ratingMin: min, ratingMax: max }),
  
  setUsersRange: (range) => set({ usersRange: range }),
  
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag]
  })),
  
  setSubscriptionFilter: (filter) => set({ subscriptionFilter: filter }),
  
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { userPassword, user } = get();
    
    if (email && password) {
      if (user && user.email === email && userPassword === password) {
        set({ isAuthenticated: true });
        return true;
      }
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20simple%20minimal&image_size=square',
      };
      set({ user: newUser, isAuthenticated: true, userPassword: password });
      return true;
    }
    return false;
  },
  
  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (name && email && password) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20simple%20minimal&image_size=square',
      };
      set({ user: newUser, isAuthenticated: true, userPassword: password });
      return true;
    }
    return false;
  },
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateUserProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  
  changePassword: async (oldPassword, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { userPassword } = get();
    if (userPassword === oldPassword) {
      set({ userPassword: newPassword });
      return true;
    }
    return false;
  },
  
  updateNotificationSettings: (settings) =>
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
    })),
  
  addSubscription: (subscription) => 
    set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),
  
  cancelSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'cancelled' as const, autoRenew: false } : sub
      ),
    })),
  
  renewSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id 
          ? { 
              ...sub, 
              status: 'active' as const, 
              autoRenew: true,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            } 
          : sub
      ),
    })),
  
  toggleAutoRenew: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, autoRenew: !sub.autoRenew } : sub
      ),
    })),
  
  downloadInvoice: (id) => {
    const subscription = get().subscriptions.find(s => s.id === id);
    if (!subscription) return;
    
    const invoiceContent = `
发票
=====================================
发票编号: INV-${id.toUpperCase()}
日期: ${new Date().toLocaleDateString('zh-CN')}

订阅信息:
工具名称: ${subscription.toolName}
订阅方案: ${subscription.planName}
订阅周期: ${subscription.period === 'monthly' ? '月度' : '年度'}
开始日期: ${subscription.startDate}
结束日期: ${subscription.endDate}

费用明细:
=====================================
订阅费用: ¥${subscription.price}
=====================================
总计: ¥${subscription.price}

感谢您使用 SubHub!
    `.trim();
    
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `发票-${subscription.toolName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
  
  getFilteredTools: () => {
    const { tools, selectedCategory, searchQuery, priceMin, priceMax, ratingMin, ratingMax, usersRange, selectedTags, subscriptionFilter, sortBy, subscriptions } = get();
    
    const filtered = tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      
      const matchesSearch = !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const minPrice = Math.min(...tool.plans.map(p => p.price));
      const matchesPrice = minPrice >= priceMin && minPrice <= priceMax;
      
      const matchesRating = tool.rating >= ratingMin && tool.rating <= ratingMax;
      
      let matchesUsers = true;
      switch (usersRange) {
        case 'lt-10k':
          matchesUsers = tool.usersCount < 10000;
          break;
        case '10k-50k':
          matchesUsers = tool.usersCount >= 10000 && tool.usersCount < 50000;
          break;
        case '50k-100k':
          matchesUsers = tool.usersCount >= 50000 && tool.usersCount < 100000;
          break;
        case 'gt-100k':
          matchesUsers = tool.usersCount >= 100000;
          break;
      }
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => tool.tags.includes(tag));
      
      let matchesSubscription = true;
      const userSub = subscriptions.find(s => s.toolId === tool.id);
      switch (subscriptionFilter) {
        case 'subscribed':
          matchesSubscription = !!userSub && userSub.status === 'active';
          break;
        case 'not-subscribed':
          matchesSubscription = !userSub || userSub.status !== 'active';
          break;
        case 'expired':
          matchesSubscription = !!userSub && userSub.status === 'expired';
          break;
      }
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesUsers && matchesTags && matchesSubscription;
    });
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return Math.min(...a.plans.map(p => p.price)) - Math.min(...b.plans.map(p => p.price));
        case 'price-high':
          return Math.min(...b.plans.map(p => p.price)) - Math.min(...a.plans.map(p => p.price));
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'users-desc':
          return b.usersCount - a.usersCount;
        case 'users-asc':
          return a.usersCount - b.usersCount;
        case 'popular':
        default:
          return b.usersCount - a.usersCount;
      }
    });
  },
  
  clearAllFilters: () => set({
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'popular',
    priceMin: 0,
    priceMax: 1000,
    ratingMin: 0,
    ratingMax: 5,
    usersRange: 'all',
    selectedTags: [],
    subscriptionFilter: 'all',
  }),
  
  getAllTags: () => {
    const { tools } = get();
    const tagSet = new Set<string>();
    tools.forEach(tool => tool.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  },
  
  getPriceRange: () => {
    const { tools } = get();
    const prices = tools.flatMap(tool => tool.plans.map(p => p.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },

  recordView: (toolId, source) => {
    const state = get();
    const now = Date.now();
    const views = state.toolViews;
    const lastIndex = views.reduceRight<number>((found, view, index) => {
      if (found === -1 && view.toolId === toolId && view.source === source) return index;
      return found;
    }, -1);

    // 同一来源的短时间重复挂载/曝光只更新时间，不新增记录
    if (lastIndex !== -1 && now - views[lastIndex].timestamp < VIEW_DEDUP_WINDOW) {
      return;
    }

    const nextViews = [...views, { toolId, source, timestamp: now }];
    if (nextViews.length > MAX_VIEW_RECORDS) {
      nextViews.splice(0, nextViews.length - MAX_VIEW_RECORDS);
    }
    set({ toolViews: nextViews });
    persist(VIEWS_STORAGE_KEY, nextViews);
  },

  clearViews: () => {
    set({ toolViews: [] });
    persist(VIEWS_STORAGE_KEY, []);
  },

  markDisliked: (toolId) => {
    const { dislikedToolIds } = get();
    if (dislikedToolIds.includes(toolId)) return;
    const next = [...dislikedToolIds, toolId];
    set({ dislikedToolIds: next });
    persist(DISLIKED_STORAGE_KEY, next);
  },

  undoDislike: (toolId) => {
    const next = get().dislikedToolIds.filter(id => id !== toolId);
    set({ dislikedToolIds: next });
    persist(DISLIKED_STORAGE_KEY, next);
  },

  clearFeedback: () => {
    set({ dislikedToolIds: [] });
    persist(DISLIKED_STORAGE_KEY, []);
  },

  getRecommendations: () => {
    const { tools, toolViews, subscriptions, dislikedToolIds } = get();
    return buildRecommendations({
      tools,
      views: toolViews,
      subscriptions,
      dislikedToolIds,
    });
  },
}));
