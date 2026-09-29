import { motion } from 'framer-motion';
import { 
  Wallet, 
  Users, 
  BarChart3, 
  Shield,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: '成本优化',
    description: '按需订阅，避免浪费，平均降低软件采购成本50%',
    color: 'from-green-500 to-emerald-500',
    points: ['灵活的月付/年付方案', '随时取消订阅', '统一账单管理'],
  },
  {
    icon: Users,
    title: '团队协作',
    description: '一键分配订阅，管理团队成员使用权限',
    color: 'from-blue-500 to-cyan-500',
    points: ['成员角色管理', '订阅批量分配', '使用情况统计'],
  },
  {
    icon: BarChart3,
    title: '数据分析',
    description: '全面的使用分析，优化订阅配置',
    color: 'from-purple-500 to-pink-500',
    points: ['支出趋势分析', '分类占比统计', '优化建议推荐'],
  },
  {
    icon: Shield,
    title: '安全保障',
    description: '企业级安全标准，数据加密存储',
    color: 'from-amber-500 to-orange-500',
    points: ['SSO单点登录', '审计日志', '合规认证'],
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            为什么选择<span className="gradient-text">SubHub</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            我们致力于为企业提供最优质的SaaS订阅管理服务
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>

                <ul className="space-y-3 mt-6">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
