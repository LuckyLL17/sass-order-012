import { motion } from 'framer-motion';

const stats = [
  { value: '100+', label: '优质工具' },
  { value: '50K+', label: '企业用户' },
  { value: '30%+', label: '平均成本节省' },
  { value: '99.9%', label: '服务可用性' },
];

export default function Stats() {
  return (
    <section className="py-20 bg-dark-900 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
