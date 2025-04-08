
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon, ExternalLinkIcon } from 'lucide-react';

interface TrendItem {
  name: string;
  detail?: string;
  link?: string;
}

interface TrendCardProps {
  title: string;
  items: (string | TrendItem)[];
  icon?: React.ReactNode;
  className?: string;
  onItemClick?: (item: string | TrendItem) => void;
}

const TrendCard = ({ title, items, icon, className, onItemClick }: TrendCardProps) => {
  const handleItemClick = (item: string | TrendItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (typeof item !== 'string' && item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

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
          {items.map((item, index) => {
            const isClickable = typeof item !== 'string' && (!!item.link || !!onItemClick);
            const displayText = typeof item === 'string' ? item : item.name;
            const detailText = typeof item !== 'string' ? item.detail : undefined;
            
            return (
              <li 
                key={index} 
                className={`text-sm text-gray-700 ${isClickable ? 'cursor-pointer hover:text-brand-purple flex items-start' : ''}`}
                onClick={() => isClickable && handleItemClick(item)}
              >
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <div>
                    <div className="flex items-center gap-1">
                      <span>{displayText}</span>
                      {typeof item !== 'string' && item.link && (
                        <ExternalLinkIcon className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    {detailText && <p className="text-xs text-gray-500 mt-1">{detailText}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
