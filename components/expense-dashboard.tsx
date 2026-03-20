'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency } from '@/lib/expense-engine'
import { createClient } from '@/lib/supabase/client'
import { AnalyticsCards } from './analytics-cards'
import { TransactionForm } from './transaction-form'
import { AddBalanceForm } from './add-balance-form'
import { TransactionList } from './transaction-list'
import { CategoryChart } from './category-chart'
import { SpendingTrends, MonthlyTrendsList } from './spending-trends'
import { SplitBillUtility } from './split-bill'
import { MonthlySummary } from './monthly-summary'
import { ContactFooter } from './contact-footer'
import { ThemeToggle } from './theme-toggle'
import Image from 'next/image'
import { LayoutDashboard, PieChart, Receipt, Users, LogOut, User, Sparkles } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ExpenseDashboardProps {
  user: SupabaseUser
}

export function ExpenseDashboard({ user }: ExpenseDashboardProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">SmartSpend</h1>
                <p className="text-xs text-muted-foreground">Track Your Expenses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-xl">
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">{userName}</span>
              </div>
              
              <AddBalanceForm />
              <TransactionForm />
              
              <ThemeToggle />
              
              {/* Logout Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                disabled={loggingOut}
                className="border-border text-foreground hover:text-destructive hover:border-destructive/50 rounded-xl"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-secondary/80 backdrop-blur-sm border border-border/50 p-1.5 w-full sm:w-auto inline-flex rounded-2xl shadow-lg">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 rounded-xl transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 rounded-xl transition-all"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 rounded-xl transition-all"
            >
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="split"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 rounded-xl transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Split Bills</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <AnalyticsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <SpendingTrends />
                <TransactionList />
              </div>
              <div className="space-y-6">
                <CategoryChart />
                <MonthlyTrendsList />
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <TransactionList />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart />
              <SpendingTrends />
            </div>
            <MonthlyTrendsList />
          </TabsContent>

          {/* Split Bills Tab */}
          <TabsContent value="split" className="space-y-6">
            <SplitBillUtility />
          </TabsContent>
        </Tabs>
      </main>

      {/* Contact Footer */}
      <ContactFooter />
    </div>
  )
}
