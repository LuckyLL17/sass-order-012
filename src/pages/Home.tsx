import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Categories from '@/components/home/Categories';
import PersonalizedTools from '@/components/home/PersonalizedTools';
import Features from '@/components/home/Features';
import Pricing from '@/components/home/Pricing';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <Categories />
      <PersonalizedTools />
      <Features />
      <Pricing />
    </div>
  );
}
