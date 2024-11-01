// src/components/ui/chart.tsx
import React from 'react'

import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { label: string; color: string }>
}

export function ChartContainer({
  config,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div {...props}>
      <style>
        {Object.entries(config)
          .map(
            ([key, value]) => `
          :root {
            --color-${key}: ${value.color};
          }
        `
          )
          .join("\n")}
      </style>
      {children}
    </div>
  )
}

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  config: Record<string, { label: string; color: string }>
}

export const ChartTooltipContent: React.FC<ChartTooltipProps> = ({ active, payload, label, config }) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {payload.map((item) => (
          <div key={item.name} className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {config[item.name as keyof typeof config]?.label ?? item.name}
            </span>
            <span className="font-bold text-muted-foreground">
              {Number(item.value).toFixed(2)} {/* Format tooltip value */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}