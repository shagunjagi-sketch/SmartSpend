'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import type { Transaction, Category, TriageType, SplitBill, SplitBillParticipant, UserSettings, AnalyticsData, PaymentMode } from './types'
import { calculateAnalytics, generateId } from './expense-engine'

interface ExpenseContextType {
  transactions: Transaction[]
  splitBills: SplitBill[]
  settings: UserSettings
  analytics: AnalyticsData
  balance: number
  isLoading: boolean
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addSplitBill: (bill: Omit<SplitBill, 'id'>) => void
  updateSplitBill: (id: string, updates: Partial<SplitBill>) => void
  deleteSplitBill: (id: string) => void
  updateSettings: (updates: Partial<UserSettings>) => void
  addBalance: (amount: number) => void
}

const ExpenseContext = createContext<ExpenseContextType | null>(null)

// Sample data generator for demo
function generateSampleData(): Transaction[] {
  const categories: Category[] = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'other']
  const paymentModes: PaymentMode[] = ['cash', 'online', 'upi', 'card']
  const descriptions: Record<Category, string[]> = {
    food: ['Swiggy Order', 'Zomato', 'Coffee at Starbucks', 'Pizza Hut', 'Chai & Snacks'],
    transport: ['Uber ride', 'Ola Auto', 'Metro Card', 'Petrol', 'Rapido'],
    shopping: ['Amazon', 'Flipkart', 'Myntra', 'Reliance Trends', 'D-Mart'],
    bills: ['Electricity Bill', 'Internet', 'Phone Recharge', 'Netflix', 'Spotify'],
    entertainment: ['Movie tickets', 'Gaming', 'Concert', 'Bowling', 'Books'],
    other: ['Gift for friend', 'Miscellaneous', 'Emergency', 'Donation', 'Gym']
  }

  const transactions: Transaction[] = []
  const now = new Date()

  // Generate 60 days of transactions
  for (let i = 0; i < 60; i++) {
    const dayOffset = Math.floor(Math.random() * 60)
    const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000)
    
    // 1-3 transactions per iteration
    const numTransactions = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < numTransactions; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const descOptions = descriptions[category]
      const description = descOptions[Math.floor(Math.random() * descOptions.length)]
      const paymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)]
      
      // Amount varies by category (in INR)
      let baseAmount = 100
      if (category === 'bills') baseAmount = 500
      else if (category === 'shopping') baseAmount = 800
      else if (category === 'food') baseAmount = 250
      else if (category === 'transport') baseAmount = 150
      else if (category === 'entertainment') baseAmount = 400
      else if (category === 'other') baseAmount = 300

      const amount = baseAmount + Math.random() * baseAmount * 0.5

      transactions.push({
        id: generateId(),
        amount: Math.round(amount * 100) / 100,
        date,
        category,
        triage: Math.random() > 0.4 ? 'need' : 'want',
        description,
        paymentMode,
        createdAt: date,
        updatedAt: date
      })
    }
  }

  return transactions
}

// Default analytics to avoid hydration mismatch
const defaultAnalytics: AnalyticsData = {
  totalSpent: 0,
  dailyBurnRate: 0,
  daysToBroke: Infinity,
  remainingBalance: 0,
  needsTotal: 0,
  wantsTotal: 0,
  needsWantsRatio: { needs: 0, wants: 0 },
  categoryBreakdown: [],
  monthlyTrends: []
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [splitBills, setSplitBills] = useState<SplitBill[]>([])
  const [balance, setBalance] = useState(50000) // Initial balance in INR
  const [settings, setSettings] = useState<UserSettings>({
    monthlyBudget: 50000,
    savingsGoal: 10000,
    currency: 'INR'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Generate sample data only on client after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const sampleData = generateSampleData()
    setTransactions(sampleData)
    setIsLoading(false)
  }, [])

  const analytics = useMemo(() => {
    if (!mounted) return defaultAnalytics
    return calculateAnalytics(transactions, settings.monthlyBudget)
  }, [transactions, settings.monthlyBudget, mounted])

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    setTransactions((prev) => [...prev, newTransaction])
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date() }
          : t
      )
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addSplitBill = useCallback((bill: Omit<SplitBill, 'id'>) => {
    const newBill: SplitBill = {
      ...bill,
      id: generateId()
    }
    setSplitBills((prev) => [...prev, newBill])
  }, [])

  const updateSplitBill = useCallback((id: string, updates: Partial<SplitBill>) => {
    setSplitBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      )
    )
  }, [])

  const deleteSplitBill = useCallback((id: string) => {
    setSplitBills((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => prev + amount)
  }, [])

  const value: ExpenseContextType = {
    transactions,
    splitBills,
    settings,
    analytics,
    balance,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSplitBill,
    updateSplitBill,
    deleteSplitBill,
    updateSettings,
    addBalance
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}
