'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency } from '@/lib/expense-engine'
import { Flame, Clock, TrendingDown, Wallet, CircleDollarSign, ShoppingBag, IndianRupee } from 'lucide-react'

export function AnalyticsCards() {
  const { analytics, settings, balance, isLoading } = useExpenses()

  const burnRateColor = analytics.dailyBurnRate > settings.monthlyBudget / 30 
    ? 'text-destructive' 
    : 'text-primary'

  const daysToBrokeColor = analytics.daysToBroke < 7 
    ? 'text-destructive' 
    : analytics.daysToBroke < 14 
      ? 'text-warning' 
      : 'text-success'

  const balancePercentage = (analytics.remainingBalance / settings.monthlyBudget) * 100

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border/50 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Balance
          </CardTitle>
          <div className="p-2 rounded-xl bg-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground flex items-center">
            <IndianRupee className="h-6 w-6" />
            {balance.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Available balance
          </p>
        </CardContent>
      </Card>

      {/* Total Spent This Month */}
      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <div className="p-2 rounded-xl bg-destructive/20">
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(analytics.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {analytics.transactionCount} transactions this month
          </p>
        </CardContent>
      </Card>

      {/* Daily Burn Rate */}
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Daily Burn Rate
          </CardTitle>
          <div className={`p-2 rounded-xl ${burnRateColor === 'text-destructive' ? 'bg-destructive/20' : 'bg-primary/20'}`}>
            <Flame className={`h-5 w-5 ${burnRateColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${burnRateColor}`}>
            {formatCurrency(analytics.dailyBurnRate)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on last 30 days
          </p>
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${burnRateColor === 'text-destructive' ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, (analytics.dailyBurnRate / (settings.monthlyBudget / 30)) * 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Days to Broke */}
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Days to Broke
          </CardTitle>
          <div className={`p-2 rounded-xl ${
            analytics.daysToBroke < 7 ? 'bg-destructive/20' : 
            analytics.daysToBroke < 14 ? 'bg-warning/20' : 'bg-success/20'
          }`}>
            <Clock className={`h-5 w-5 ${daysToBrokeColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${daysToBrokeColor}`}>
            {analytics.daysToBroke === Infinity ? 'Safe' : `${analytics.daysToBroke} days`}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            At current spending rate
          </p>
          <div className="mt-3 flex items-center gap-2">
            {analytics.daysToBroke < 14 && analytics.daysToBroke !== Infinity && (
              <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-medium">
                Action needed
              </span>
            )}
            {analytics.daysToBroke >= 14 && analytics.daysToBroke !== Infinity && (
              <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">
                On track
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Needs */}
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Needs
          </CardTitle>
          <div className="p-2 rounded-xl bg-need/20">
            <CircleDollarSign className="h-5 w-5 text-need" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-need">
            {formatCurrency(analytics.needsTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {analytics.totalSpent > 0 
              ? `${((analytics.needsTotal / analytics.totalSpent) * 100).toFixed(1)}% of total spending`
              : '0% of total'
            }
          </p>
        </CardContent>
      </Card>

      {/* Wants */}
      <Card className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Wants
          </CardTitle>
          <div className="p-2 rounded-xl bg-want/20">
            <ShoppingBag className="h-5 w-5 text-want" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-want">
            {formatCurrency(analytics.wantsTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {analytics.totalSpent > 0 
              ? `${((analytics.wantsTotal / analytics.totalSpent) * 100).toFixed(1)}% of total spending`
              : '0% of total'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
