'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency } from '@/lib/expense-engine'
import { CATEGORY_CONFIG, type Category } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const CHART_COLORS = [
  '#d4a574', '#8b7355', '#c4956a', '#9a8b7a', '#b8956e',
  '#a68b6a', '#c98b6a', '#b39574', '#8a7a65', '#a89968',
  '#9a8a75', '#7a6a55'
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
      <Card className="bg-card border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg font-semibold">Spending by Category</CardTitle>
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
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
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground">
            <p>No spending data for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ₹${formatCurrency(entry.value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {/* Category breakdown */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {chartData.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                <p className="text-sm font-semibold text-foreground">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
