'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency } from '@/lib/expense-engine'
import { CATEGORY_CONFIG, type Category } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Gen-Z Vibrant color palette for chart segments
const CHART_COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#DDA0DD', // Plum
  '#A8D8EA', // Sky Blue
]

type FilterPeriod = 'monthly' | 'quarterly'

interface ChartDataItem {
  name: string
  value: number
  category: Category
  color: string
  percentage: number
}

export function CategoryChart() {
  const { transactions, isLoading } = useExpenses()
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('monthly')

  const chartData = useMemo<ChartDataItem[]>(() => {
    const now = new Date()
    let startDate: Date

    if (filterPeriod === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else {
      // Quarterly - last 3 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    }

    const filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate)

    // Calculate category totals
    const categoryTotals = new Map<Category, number>()
    let total = 0

    for (const transaction of filteredTransactions) {
      const current = categoryTotals.get(transaction.category) || 0
      categoryTotals.set(transaction.category, current + transaction.amount)
      total += transaction.amount
    }

    // Convert to chart data format
    const data: ChartDataItem[] = []
    const categories = Object.keys(CATEGORY_CONFIG) as Category[]

    categories.forEach((category, index) => {
      const amount = categoryTotals.get(category) || 0
      if (amount > 0) {
        data.push({
          name: CATEGORY_CONFIG[category].label,
          value: amount,
          category,
          color: CHART_COLORS[index % CHART_COLORS.length],
          percentage: total > 0 ? (amount / total) * 100 : 0
        })
      }
    })

    return data.sort((a, b) => b.value - a.value)
  }, [transactions, filterPeriod])

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-muted-foreground">No spending data yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg font-semibold">Spending by Category</CardTitle>
          <div className="flex gap-1 p-1 bg-secondary rounded-xl">
            <button
              onClick={() => setFilterPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setFilterPeriod('quarterly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterPeriod === 'quarterly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    className="drop-shadow-md hover:drop-shadow-lg transition-all cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend data={chartData} />}
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataItem }> }) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <p className="font-semibold text-foreground">{data.name}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatCurrency(data.value)} 
        <span className="ml-1 text-primary font-medium">({data.percentage.toFixed(1)}%)</span>
      </p>
    </div>
  )
}

function CustomLegend({ data }: { data: ChartDataItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
