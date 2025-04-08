
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon } from 'lucide-react';

interface TrendCardProps {
  title: string;
  items: string[];
  icon?: React.ReactNode;
  className?: string;
}

const TrendCard = ({ title, items, icon, className }: TrendCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          {icon || <TrendingUpIcon className="h-5 w-5 text-brand-purple" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
