import type { UserSubscription, Bill, MonthlySpending, CategorySpending } from '@/types';

export const userSubscriptions: UserSubscription[] = [
  {
    id: 'sub-1',
    toolId: '1',
    toolName: 'Figma',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=figma%20logo%20minimal%20design%20gradient&image_size=square',
    planName: 'Professional',
    price: 45,
    period: 'monthly',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-2',
    toolId: '2',
    toolName: 'GitHub Pro',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=github%20logo%20minimal%20dark%20theme&image_size=square',
    planName: 'Pro',
    price: 32,
    period: 'monthly',
    startDate: '2024-02-01',
    endDate: '2026-02-01',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-3',
    toolId: '3',
    toolName: 'Notion',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=notion%20logo%20minimal%20black%20white&image_size=square',
    planName: 'Plus',
    price: 28,
    period: 'monthly',
    startDate: '2024-03-10',
    endDate: '2026-03-10',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-4',
    toolId: '5',
    toolName: 'VS Code Pro',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vscode%20logo%20blue%20gradient%20minimal&image_size=square',
    planName: 'Pro',
    price: 19,
    period: 'monthly',
    startDate: '2023-11-20',
    endDate: '2024-11-20',
    status: 'expired',
    autoRenew: false
  }
];

export const bills: Bill[] = [
  {
    id: 'bill-1',
    date: '2025-06-01',
    amount: 105,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 }
    ]
  },
  {
    id: 'bill-2',
    date: '2025-05-01',
    amount: 105,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 }
    ]
  },
  {
    id: 'bill-3',
    date: '2025-04-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-4',
    date: '2025-03-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-5',
    date: '2025-02-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-6',
    date: '2025-01-01',
    amount: 96,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 19 }
    ]
  }
];

export const monthlySpending: MonthlySpending[] = [
  { month: '1月', amount: 96 },
  { month: '2月', amount: 124 },
  { month: '3月', amount: 124 },
  { month: '4月', amount: 124 },
  { month: '5月', amount: 105 },
  { month: '6月', amount: 105 }
];

export const categorySpending: CategorySpending[] = [
  { name: '设计工具', value: 45 },
  { name: '开发工具', value: 32 },
  { name: '协作工具', value: 28 }
];

export const pricingPlans = [
  {
    id: 'personal',
    name: '个人版',
    description: '适合个人开发者和自由职业者',
    price: 0,
    period: 'monthly',
    features: [
      '浏览所有工具',
      '最多5个活跃订阅',
      '基础账单管理',
      '社区支持'
    ],
    recommended: false
  },
  {
    id: 'team',
    name: '团队版',
    description: '适合中小企业和创业团队',
    price: 29,
    period: 'monthly',
    features: [
      '所有个人版功能',
      '无限活跃订阅',
      '团队成员管理',
      '订阅分配功能',
      '高级账单分析',
      '优先客户支持',
      '专属客户经理'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合大型企业和机构',
    price: 99,
    period: 'monthly',
    features: [
      '所有团队版功能',
      'SSO单点登录',
      '高级安全审计',
      '定制化集成',
      '专属技术支持',
      'SLA服务保障',
      '定制化培训'
    ],
    recommended: false
  }
];
