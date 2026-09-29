import type { User } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: '张明',
  email: 'zhangming@example.com',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20male%20avatar%20portrait%20simple&image_size=square',
  teamId: 'team-1',
  teamRole: 'admin'
};

export const loginDevices = [
  {
    id: 'device-1',
    name: 'MacBook Pro',
    type: 'laptop',
    browser: 'Chrome',
    location: '北京',
    lastActive: '2025-06-05 14:30',
    current: true
  },
  {
    id: 'device-2',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    browser: 'Safari',
    location: '北京',
    lastActive: '2025-06-04 09:15',
    current: false
  },
  {
    id: 'device-3',
    name: 'iPad Pro',
    type: 'tablet',
    browser: 'Safari',
    location: '上海',
    lastActive: '2025-06-02 18:45',
    current: false
  }
];
