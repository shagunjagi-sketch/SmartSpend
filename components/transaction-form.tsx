'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useExpenses } from '@/lib/expense-store'
import type { Category, TriageType, PaymentMode } from '@/lib/types'
import { CATEGORY_CONFIG, PAYMENT_MODE_CONFIG, USD_TO_INR_RATE } from '@/lib/types'
import { Plus, UtensilsCrossed, Car, ShoppingBag, Receipt, Gamepad2, MoreHorizontal, Banknote, Globe, Smartphone, CreditCard, ArrowRightLeft } from 'lucide-react'

const categoryIcons: Record<Category, React.ReactNode> = {
  food: <UtensilsCrossed className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
  bills: <Receipt className="h-4 w-4" />,
  entertainment: <Gamepad2 className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />
}

const paymentIcons: Record<PaymentMode, React.ReactNode> = {
  cash: <Banknote className="h-4 w-4" />,
  online: <Globe className="h-4 w-4" />,
  card: <CreditCard className="h-4 w-4" />
}

interface TransactionFormProps {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { addTransaction } = useExpenses()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isUSD, setIsUSD] = useState(false)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash')
  const [triage, setTriage] = useState<TriageType>('need')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const convertedAmount = isUSD && amount ? parseFloat(amount) * USD_TO_INR_RATE : parseFloat(amount) || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !description) return

    const finalAmount = isUSD ? parseFloat(amount) * USD_TO_INR_RATE : parseFloat(amount)

    addTransaction({
      amount: Math.round(finalAmount * 100) / 100,
      amountUSD: isUSD ? parseFloat(amount) : undefined,
      description,
      category,
      paymentMode,
      triage,
      date: new Date(date)
    })

    // Reset form
    setAmount('')
    setIsUSD(false)
    setDescription('')
    setCategory('food')
    setPaymentMode('cash')
    setTriage('need')
    setDate(new Date().toISOString().split('T')[0])
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">Add New Expense</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Track your spending by adding a new expense entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Amount Input with USD/INR Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-foreground font-medium">Amount</Label>
              <button
                type="button"
                onClick={() => setIsUSD(!isUSD)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                <ArrowRightLeft className="h-3 w-3" />
                {isUSD ? 'USD' : 'INR'}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {isUSD ? '$' : '₹'}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-secondary border-border text-foreground rounded-xl h-12"
                required
              />
            </div>
            {isUSD && amount && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3" />
                Converts to: <span className="font-semibold text-primary">₹{convertedAmount.toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border text-foreground rounded-xl h-12"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-medium">Category</Label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger className="bg-secondary border-border text-foreground rounded-xl h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl">
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-foreground rounded-lg">
                    <span>{CATEGORY_CONFIG[cat].label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Payment Mode</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(PAYMENT_MODE_CONFIG) as PaymentMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    paymentMode === mode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {paymentIcons[mode]}
                  <span className="text-xs font-medium">{PAYMENT_MODE_CONFIG[mode].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border text-foreground rounded-xl h-12"
              required
            />
          </div>

          {/* Need/Want Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
            <div className="space-y-0.5">
              <Label htmlFor="triage" className="text-foreground font-medium">Type</Label>
              <p className="text-xs text-muted-foreground">
                {triage === 'need' ? 'Essential expense' : 'Non-essential expense'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${triage === 'need' ? 'text-need font-semibold' : 'text-muted-foreground'}`}>
                Need
              </span>
              <Switch
                id="triage"
                checked={triage === 'want'}
                onCheckedChange={(checked) => setTriage(checked ? 'want' : 'need')}
                className="data-[state=checked]:bg-want data-[state=unchecked]:bg-need"
              />
              <span className={`text-sm ${triage === 'want' ? 'text-want font-semibold' : 'text-muted-foreground'}`}>
                Want
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-base font-semibold">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
