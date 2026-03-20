'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency, quickSortTransactions, binarySearchDateRange } from '@/lib/expense-engine'
import { CATEGORY_CONFIG } from '@/lib/types'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type TimePeriod = '15d' | '30d' | '90d' | 'year'

export function SpendingTrends() {
  const { transactions, isLoading } = useExpenses()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d')

  const dailySpendingData = useMemo(() => {
    if (isLoading) return []
    
    const now = new Date()
    let startDate: Date
    let groupBy: 'day' | 'week' | 'month' = 'day'

    if (timePeriod === '15d') {
      startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      groupBy = 'day'
    } else if (timePeriod === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      groupBy = 'day'
    } else if (timePeriod === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      groupBy = 'week'
    } else {
      // Last year
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      groupBy = 'month'
    }
    
    const sortedTransactions = quickSortTransactions(transactions, 'date', true)
    const recentTransactions = binarySearchDateRange(sortedTransactions, startDate, now)

    // Group by selected period
    const periodTotals = new Map<string, number>()
    
    for (const t of recentTransactions) {
      let dateKey: string
      let displayDate: string

      if (groupBy === 'day') {
        dateKey = t.date.toISOString().split('T')[0]
        displayDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (groupBy === 'week') {
        const weekStart = new Date(t.date)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        dateKey = weekStart.toISOString().split('T')[0]
        displayDate = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      } else {
        // Month
        const month = t.date.toISOString().slice(0, 7)
        dateKey = month
        displayDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }

      periodTotals.set(dateKey, (periodTotals.get(dateKey) || 0) + t.amount)
    }

    // Fill in missing periods with 0
    const result: { date: string; amount: number; displayDate: string }[] = []
    const current = new Date(startDate)
    
    while (current <= now) {
      let dateKey: string
      let displayDate: string

      if (groupBy === 'day') {
        dateKey = current.toISOString().split('T')[0]
        displayDate = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        result.push({
          date: dateKey,
          amount: periodTotals.get(dateKey) || 0,
          displayDate
        })
        current.setDate(current.getDate() + 1)
      } else if (groupBy === 'week') {
        const weekStart = new Date(current)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        dateKey = weekStart.toISOString().split('T')[0]
        displayDate = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        
        if (!result.some(r => r.date === dateKey)) {
          result.push({
            date: dateKey,
            amount: periodTotals.get(dateKey) || 0,
            displayDate
          })
        }
        current.setDate(current.getDate() + 7)
      } else {
        // Month
        const month = current.toISOString().slice(0, 7)
        dateKey = month
        displayDate = current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        
        if (!result.some(r => r.date === dateKey)) {
          result.push({
            date: dateKey,
            amount: periodTotals.get(dateKey) || 0,
            displayDate
          })
        }
        current.setMonth(current.getMonth() + 1)
      }
    }

    return result
  }, [transactions, isLoading, timePeriod])

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const avgSpending = dailySpendingData.length > 0 
    ? dailySpendingData.reduce((sum, d) => sum + d.amount, 0) / dailySpendingData.length
    : 0
  const maxSpending = dailySpendingData.length > 0 
    ? Math.max(...dailySpendingData.map(d => d.amount))
    : 0
  const totalSpending = dailySpendingData.reduce((sum, d) => sum + d.amount, 0)

  return (
    <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg font-semibold">Spending Trends</CardTitle>
          <div className="flex gap-1.5 p-1 bg-secondary/50 rounded-xl">
            {(['15d', '30d', '90d', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  timePeriod === period
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period === '15d' ? '15d' : period === '30d' ? '30d' : period === '90d' ? '90d' : '1y'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
              <p className="text-xs text-muted-foreground font-medium mb-1">Total</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalSpending)}</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 border border-accent/20">
              <p className="text-xs text-muted-foreground font-medium mb-1">Average</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(avgSpending)}</p>
            </div>
            <div className="bg-success/10 rounded-xl p-3 border border-success/20">
              <p className="text-xs text-muted-foreground font-medium mb-1">Peak Day</p>
              <p className="text-lg font-bold text-success">{formatCurrency(maxSpending)}</p>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)"
                  dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { date: string; amount: number; displayDate: string } }> }) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl">
      <p className="text-sm font-semibold text-foreground">{data.displayDate}</p>
      <p className="text-sm text-primary font-bold">{formatCurrency(data.amount)}</p>
    </div>
  )
}

export function MonthlyTrendsList() {
  const { analytics } = useExpenses()

  if (analytics.monthlyTrends.length === 0) {
    return (
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold">Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No trend data available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">Category Trends (Current vs Previous Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analytics.monthlyTrends.map((trend) => (
            <div key={trend.category} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_CONFIG[trend.category].color }}
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">{CATEGORY_CONFIG[trend.category].label}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {formatCurrency(trend.currentMonth)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {trend.direction === 'up' && <TrendingUp className="h-4 w-4 text-destructive" />}
                {trend.direction === 'down' && <TrendingDown className="h-4 w-4 text-success" />}
                {trend.direction === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                <span className={`text-sm font-semibold ${
                  trend.direction === 'up' ? 'text-destructive' : 
                  trend.direction === 'down' ? 'text-success' : 
                  'text-muted-foreground'
                }`}>
                  {trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
