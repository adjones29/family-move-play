import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;              // e.g., 'Daily Family Steps'
  value: string | number;     // e.g., '1,950'
  subLabel: string;           // e.g., 'Today' or 'Sun - Sat'
  icon?: React.ReactNode;     // lucide icon
  accent?: 'pink' | 'green' | 'blue' | 'indigo' | 'orange';
  className?: string;
};

const accentMap: Record<NonNullable<Props['accent']>, string> = {
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  orange: 'bg-orange-500'
};

export default function MetricCard({ title, value, subLabel, icon, accent = 'pink', className }: Props) {
  return (
    <div className={cn('relative rounded-2xl shadow-md p-4 bg-white w-[260px] md:w-[280px] h-[160px] select-none', className)}>
      {/* Icon */}
      {icon && (
        <div className={cn('absolute top-3 right-3 flex items-center justify-center rounded-xl w-8 h-8 md:w-9 md:h-9', accentMap[accent])}>
          <div className='text-white w-4 h-4 md:w-5 md:h-5'>{icon}</div>
        </div>
      )}

      {/* Header */}
      <div className='text-sm md:text-base font-medium text-gray-700 leading-tight pr-12'>
        {title}
      </div>

      {/* Value */}
      <div className='mt-2 md:mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900'>
        {value}
      </div>

      {/* Sub-label pill (bottom-left) */}
      <div className='absolute left-4 bottom-4'>
        <span className='inline-block rounded-full px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700'>{subLabel}</span>
      </div>
    </div>
  );
}
