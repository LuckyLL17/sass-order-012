import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Shield,
  TrendingUp,
  CreditCard,
  Crown,
  UserMinus,
  Settings,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { teamMembers, teamStats } from '@/mock/team';
import type { TeamMember } from '@/types';
import { cn } from '@/lib/utils';

const usageData = [
  { name: 'Figma', usage: 85 },
  { name: 'GitHub', usage: 92 },
  { name: 'Notion', usage: 78 },
  { name: 'Slack', usage: 65 },
  { name: 'VS Code', usage: 88 },
];

type TabType = 'members' | 'analytics' | 'settings';

export default function Team() {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const tabs = [
    { id: 'members' as TabType, label: '成员管理', icon: Users },
    { id: 'analytics' as TabType, label: '使用分析', icon: PieChart },
    { id: 'settings' as TabType, label: '团队设置', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              团队<span className="gradient-text">协作</span>
            </h1>
            <p className="text-xl text-gray-400">
              管理团队成员，分配订阅权限
            </p>
          </div>
          <button className="btn-primary w-full md:w-auto">
            <UserPlus className="w-4 h-4" />
            邀请成员
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">总成员</p>
                <p className="text-xl font-bold text-white">{teamStats.totalMembers}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">活跃成员</p>
                <p className="text-xl font-bold text-white">{teamStats.activeMembers}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">待邀请</p>
                <p className="text-xl font-bold text-white">{teamStats.pendingInvitations}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-secondary-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">总订阅</p>
                <p className="text-xl font-bold text-white">{teamStats.totalSubscriptions}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">月支出</p>
                <p className="text-xl font-bold text-white">¥{teamStats.monthlySpending}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">节省比例</p>
                <p className="text-xl font-bold text-green-400">{teamStats.savings}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 p-1 bg-dark-800/50 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">成员</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">角色</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">加入日期</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">订阅</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">状态</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => (
                      <MemberRow 
                        key={member.id} 
                        member={member} 
                        index={index}
                        isExpanded={selectedMember === member.id}
                        onToggle={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">工具使用率</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value}%`, '使用率']}
                    />
                    <Bar dataKey="usage" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">活跃成员排行</h3>
              <div className="space-y-4">
                {teamMembers.slice(0, 4).map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-grow">
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-gray-500 text-sm">{member.role === 'admin' ? '管理员' : '成员'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{member.subscriptions.length}</p>
                      <p className="text-gray-500 text-xs">活跃订阅</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">团队信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">团队名称</label>
                  <input type="text" defaultValue="创新科技团队" className="input" />
                </div>
                <div>
                  <label className="label">团队描述</label>
                  <textarea defaultValue="专注于产品创新和开发的高效团队" className="input h-24 resize-none" />
                </div>
                <button className="btn-primary w-full">保存更改</button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">安全设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">双因素认证</p>
                    <p className="text-gray-500 text-sm">要求所有成员启用双因素认证</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary-500 relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">SSO单点登录</p>
                    <p className="text-gray-500 text-sm">启用企业级单点登录</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-gray-700 relative">
                    <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-gray-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">会话超时</p>
                    <p className="text-gray-500 text-sm">30分钟无操作自动登出</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary-500 relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface MemberRowProps {
  member: TeamMember;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function MemberRow({ member, index, isExpanded, onToggle }: MemberRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <p className="text-white font-medium">{member.name}</p>
            <p className="text-gray-500 text-sm">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        {member.role === 'admin' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-medium border border-gold-500/30">
            <Crown className="w-3 h-3" />
            管理员
          </span>
        ) : (
          <span className="badge">成员</span>
        )}
      </td>
      <td className="py-4 px-4 text-gray-400">{member.joinDate}</td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1">
          {member.subscriptions.length > 0 ? (
            member.subscriptions.slice(0, 3).map((sub) => (
              <span key={sub} className="px-2 py-0.5 rounded bg-dark-900 text-gray-300 text-xs">
                {sub}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">暂无</span>
          )}
          {member.subscriptions.length > 3 && (
            <span className="px-2 py-0.5 rounded bg-dark-900 text-gray-400 text-xs">
              +{member.subscriptions.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        {member.status === 'active' && <span className="badge-active">活跃</span>}
        {member.status === 'pending' && <span className="badge-pending">待接受</span>}
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <UserPlus className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <UserMinus className="w-4 h-4" />
          </button>
          <button 
            onClick={onToggle}
            className={cn(
              'p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all',
              isExpanded && 'text-primary-400 bg-primary-500/10'
            )}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
