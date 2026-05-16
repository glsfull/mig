import { Video as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export default function FeatureCard({ icon: Icon, title, description, color, bgColor }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mb-4`}>
        <Icon size={22} className={color} />
      </div>
      <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
