import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  iconBgColor: string;
  onClick?: () => void;
}

export function FeatureCard({ title, icon: Icon, iconBgColor, onClick }: FeatureCardProps) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center gap-4 min-h-[180px] sm:min-h-[200px]">
      {/* Icon Container with 3D effect */}
      <div className="relative">
        {/* Shadow layer */}
        <div className="absolute inset-0 bg-black/10 rounded-xl blur-sm translate-y-2" />
        
        {/* Main icon container */}
        <div className={`relative ${iconBgColor} rounded-xl p-8 shadow-lg`}>
          <Icon className="w-12 h-12 text-white sm:w-14 sm:h-14" strokeWidth={2} />
          
          {/* Decorative red pin/marker */}
          <div className="absolute -top-2 -right-2 bg-red-600 rounded-full w-8 h-8 shadow-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Title */}
      <p className="text-gray-700 text-center">{title}</p>
    </button>
  );
}
