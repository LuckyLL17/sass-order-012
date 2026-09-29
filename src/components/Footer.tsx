import { Link } from 'react-router-dom';
import { 
  Zap, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: '产品',
      links: [
        { label: '工具市场', to: '/market' },
        { label: '定价方案', to: '/#pricing' },
        { label: '团队协作', to: '/team' },
        { label: '企业版', to: '/#enterprise' },
      ]
    },
    {
      title: '资源',
      links: [
        { label: '帮助中心', to: '#' },
        { label: '开发文档', to: '#' },
        { label: 'API文档', to: '#' },
        { label: '博客', to: '#' },
      ]
    },
    {
      title: '公司',
      links: [
        { label: '关于我们', to: '#' },
        { label: '加入我们', to: '#' },
        { label: '联系我们', to: '#' },
        { label: '合作伙伴', to: '#' },
      ]
    },
    {
      title: '法律',
      links: [
        { label: '服务条款', to: '#' },
        { label: '隐私政策', to: '#' },
        { label: 'Cookie政策', to: '#' },
        { label: '安全说明', to: '#' },
      ]
    },
  ];

  return (
    <footer className="bg-dark-900 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                SubHub
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              一站式SaaS订阅管理平台，帮助企业按需订阅各类在线工具，降低软件采购成本。
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 SubHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">服务条款</a>
            <a href="#" className="hover:text-gray-300">隐私政策</a>
            <a href="#" className="hover:text-gray-300">Cookie设置</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
