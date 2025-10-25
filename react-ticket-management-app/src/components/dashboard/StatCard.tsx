import { Card } from '../ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function StatCard({ title, value, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm mb-1">{title}</p>
          <p className="text-3xl">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
