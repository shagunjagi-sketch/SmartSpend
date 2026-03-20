'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useExpenses } from '@/lib/expense-store'
import { USD_TO_INR_RATE } from '@/lib/types'
import { Wallet, ArrowRightLeft, Plus } from 'lucide-react'

export function AddBalanceForm() {
  const { addBalance } = useExpenses()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isUSD, setIsUSD] = useState(false)

  const convertedAmount = isUSD && amount ? parseFloat(amount) * USD_TO_INR_RATE : parseFloat(amount) || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount) return

    const finalAmount = isUSD ? parseFloat(amount) * USD_TO_INR_RATE : parseFloat(amount)
    addBalance(Math.round(finalAmount * 100) / 100)

    setAmount('')
    setIsUSD(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-success/50 text-success hover:bg-success/15 hover:border-success/80 hover:text-success hover:shadow-lg hover:shadow-success/20 rounded-xl transition-all duration-300"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Add Balance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-xl bg-success/20">
              <Plus className="h-5 w-5 text-success" />
            </div>
            Add Balance
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add funds to your balance. Supports INR and USD.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="balance-amount" className="text-foreground font-medium">Amount</Label>
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
                id="balance-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-secondary border-border text-foreground rounded-xl h-14 text-lg"
                required
              />
            </div>
            {isUSD && amount && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3" />
                Converts to: <span className="font-semibold text-success">₹{convertedAmount.toFixed(2)}</span>
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-success hover:bg-success/90 text-white rounded-xl h-12 text-base font-semibold"
          >
            Add to Balance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
