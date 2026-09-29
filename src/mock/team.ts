import type { TeamMember } from '@/types';

export const teamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: '张明',
    email: 'zhangming@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20male%20avatar%20portrait%20simple&image_size=square',
    role: 'admin',
    joinDate: '2024-01-15',
    status: 'active',
    subscriptions: ['Figma', 'GitHub Pro', 'Notion']
  },
  {
    id: 'member-2',
    name: '李雪',
    email: 'lixue@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20female%20avatar%20portrait%20simple&image_size=square',
    role: 'member',
    joinDate: '2024-02-20',
    status: 'active',
    subscriptions: ['Figma', 'Notion']
  },
  {
    id: 'member-3',
    name: '王浩',
    email: 'wanghao@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20young%20male%20developer%20avatar%20portrait&image_size=square',
    role: 'member',
    joinDate: '2024-03-10',
    status: 'active',
    subscriptions: ['GitHub Pro', 'VS Code Pro']
  },
  {
    id: 'member-4',
    name: '陈静',
    email: 'chenjing@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20female%20designer%20avatar%20portrait&image_size=square',
    role: 'member',
    joinDate: '2024-04-05',
    status: 'pending',
    subscriptions: []
  },
  {
    id: 'member-5',
    name: '刘伟',
    email: 'liuwei@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20male%20marketer%20avatar%20portrait&image_size=square',
    role: 'member',
    joinDate: '2024-05-18',
    status: 'active',
    subscriptions: ['SEMrush', 'HubSpot']
  }
];

export const teamStats = {
  totalMembers: 5,
  activeMembers: 4,
  pendingInvitations: 1,
  totalSubscriptions: 12,
  monthlySpending: 420,
  savings: 35
};
