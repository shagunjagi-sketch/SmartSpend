'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency } from '@/lib/expense-engine'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DailyData {
  date: string
  total: number
}

interface MonthlyData {
  month: string
  needs: number
  wants: number
  total: number
}

export function SpendingTrends() {
  const { transactions, isLoading } = useExpenses()

  const dailyData = useMemo<DailyData[]>(() => {
    const dataMap = new Map<string, number>()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const filtered = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo)

    for (const transaction of filtered) {
      const dateStr = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const current = dataMap.get(dateStr) || 0
      dataMap.set(dateStr, current + transaction.amount)
    }

    const sortedData = Array.from(dataMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, total]) => ({ date, total }))

    return sortedData
  }, [transactions])

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
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">30-Day Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {dailyData.length === 0 ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground">
            <p>No spending data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="var(--primary)" 
                dot={{ fill: 'var(--primary)' }}
                name="Daily Spend"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function MonthlyTrendsList() {
  const { analytics, isLoading } = useExpenses()

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  const trends = analytics.monthlyTrends || []

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <p className="text-muted-foreground">No trend data available</p>
        ) : (
          <div className="space-y-3">
            {trends.map((trend) => (
              <div key={trend.category} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-sm">{trend.category}</p>
                  <p className="text-xs text-muted-foreground">
                    Previous: {formatCurrency(trend.previousMonth)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(trend.currentMonth)}</p>
                  <p className={`text-xs ${trend.direction === 'up' ? 'text-destructive' : 'text-success'}`}>
                    {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.percentageChange).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
