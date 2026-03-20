// Core Transaction Types for Student Expense Management

export type TriageType = 'need' | 'want'

export type Category = 
  | 'canteen'
  | 'stationery'
  | 'subscriptions'
  | 'transport'
  | 'hangingout'
  | 'other'

export type PaymentMode = 'cash' | 'online' | 'card'

export interface Transaction {
  id: string
  amount: number
  amountUSD?: number // Original USD amount if converted
  date: Date
  category: Category
  triage: TriageType
  description: string
  paymentMode: PaymentMode
  createdAt: Date
  updatedAt: Date
}

export interface SplitBillParticipant {
  id: string
  name: string
  share: number
  paid: boolean
}

export interface SplitBill {
  id: string
  totalAmount: number
  description: string
  date: Date
  participants: SplitBillParticipant[]
  paidBy: string
}

export interface MonthlyTrend {
  category: Category
  currentMonth: number
  previousMonth: number
  percentageChange: number
  direction: 'up' | 'down' | 'stable'
}

export interface AnalyticsData {
  dailyBurnRate: number
  daysToBroke: number
  totalSpent: number
  remainingBalance: number
  needsTotal: number
  wantsTotal: number
  categoryBreakdown: { category: Category; amount: number; percentage: number }[]
  monthlyTrends: MonthlyTrend[]
  averageTransactionSize: number
  transactionCount: number
}

export interface UserSettings {
  monthlyBudget: number
  savingsGoal: number
  currency: string
}

// Category metadata for display - Gen-Z vibrant color palette
export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  canteen: { label: 'Canteen', icon: 'UtensilsCrossed', color: '#FF6B6B' },
  stationery: { label: 'Stationery/Xerox', icon: 'BookOpen', color: '#4ECDC4' },
  subscriptions: { label: 'Subscriptions', icon: 'CreditCard', color: '#FFE66D' },
  transport: { label: 'Transport', icon: 'Car', color: '#95E1D3' },
  hangingout: { label: 'Hanging Out', icon: 'Smile', color: '#DDA0DD' },
  other: { label: 'Others', icon: 'MoreHorizontal', color: '#A8D8EA' }
}

// Payment mode metadata
export const PAYMENT_MODE_CONFIG: Record<PaymentMode, { label: string; icon: string }> = {
  cash: { label: 'Cash', icon: 'Banknote' },
  online: { label: 'Online', icon: 'Globe' },
  card: { label: 'Card', icon: 'CreditCard' }
}

// USD to INR conversion rate (can be updated dynamically)
export const USD_TO_INR_RATE = 83.5
