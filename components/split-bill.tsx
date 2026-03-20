'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useExpenses } from '@/lib/expense-store'
import { formatCurrency, generateId } from '@/lib/expense-engine'
import type { SplitBillParticipant } from '@/lib/types'
import { Users, Plus, X, Check, Copy, Share2 } from 'lucide-react'

export function SplitBillUtility() {
  const { splitBills, addSplitBill, updateSplitBill, deleteSplitBill } = useExpenses()
  const [open, setOpen] = useState(false)

  // Sort with recent bills at top
  const sortedBills = [...splitBills].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card className="bg-card border-border/50 rounded-2xl shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              Split Bills
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Manage shared expenses with friends
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2">
                <Plus className="h-4 w-4" />
                New Split
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create Split Bill</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Divide expenses among friends and track who paid what.
                </DialogDescription>
              </DialogHeader>
              <SplitBillForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedBills.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No split bills yet</p>
            <p className="text-sm mt-1">Create one to split expenses with friends</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {sortedBills.map((bill) => (
              <SplitBillItem
                key={bill.id}
                bill={bill}
                onUpdate={(updates) => updateSplitBill(bill.id, updates)}
                onDelete={() => deleteSplitBill(bill.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SplitBillForm({ onSuccess }: { onSuccess: () => void }) {
  const { addSplitBill } = useExpenses()
  const [totalAmount, setTotalAmount] = useState('')
  const [description, setDescription] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [participants, setParticipants] = useState<{ name: string; id: string }[]>([
    { name: '', id: generateId() },
    { name: '', id: generateId() }
  ])

  const addParticipant = () => {
    setParticipants([...participants, { name: '', id: generateId() }])
  }

  const removeParticipant = (id: string) => {
    if (participants.length <= 2) return
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const updateParticipant = (id: string, name: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(totalAmount)
    if (!amount || !description || !paidBy) return

    const validParticipants = participants.filter((p) => p.name.trim())
    if (validParticipants.length < 2) return

    const sharePerPerson = amount / validParticipants.length

    addSplitBill({
      totalAmount: amount,
      description,
      date: new Date(),
      paidBy,
      participants: validParticipants.map((p) => ({
        id: p.id,
        name: p.name,
        share: sharePerPerson,
        paid: p.name === paidBy
      }))
    })

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="total" className="text-foreground">Total Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="total"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="pl-7 bg-secondary border-border text-foreground"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Dinner at restaurant"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-secondary border-border text-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidBy" className="text-foreground">Who Paid?</Label>
        <Input
          id="paidBy"
          placeholder="Name of person who paid"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="bg-secondary border-border text-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-foreground">Participants</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addParticipant}
            className="text-primary hover:text-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              <Input
                placeholder="Participant name"
                value={participant.name}
                onChange={(e) => updateParticipant(participant.id, e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              {participants.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeParticipant(participant.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {totalAmount && participants.filter((p) => p.name.trim()).length >= 2 && (
          <p className="text-sm text-muted-foreground">
            Each person pays: {formatCurrency(parseFloat(totalAmount) / participants.filter((p) => p.name.trim()).length)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        Create Split Bill
      </Button>
    </form>
  )
}

function SplitBillItem({
  bill,
  onUpdate,
  onDelete
}: {
  bill: { id: string; totalAmount: number; description: string; date: Date; paidBy: string; participants: SplitBillParticipant[] }
  onUpdate: (updates: Partial<typeof bill>) => void
  onDelete: () => void
}) {
  const [copied, setCopied] = useState(false)

  const togglePaid = (participantId: string) => {
    const updatedParticipants = bill.participants.map((p) =>
      p.id === participantId ? { ...p, paid: !p.paid } : p
    )
    onUpdate({ participants: updatedParticipants })
  }

  const paidCount = bill.participants.filter((p) => p.paid).length
  const allPaid = paidCount === bill.participants.length

  const copyToClipboard = () => {
    const summary = `Split Bill: ${bill.description}
Total: ${formatCurrency(bill.totalAmount)}
Paid by: ${bill.paidBy}

Each person owes: ${formatCurrency(bill.participants[0]?.share || 0)}

Participants:
${bill.participants.map((p) => `- ${p.name}: ${p.paid ? 'Paid' : 'Pending'}`).join('\n')}`

    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 bg-secondary/50 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-foreground">{bill.description}</h4>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(bill.totalAmount)} total - Paid by {bill.paidBy}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {bill.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between py-1.5 px-2 rounded bg-background/50"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={participant.paid}
                onCheckedChange={() => togglePaid(participant.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className={`text-sm ${participant.paid ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {participant.name}
              </span>
              {participant.name === bill.paidBy && (
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                  Paid
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(participant.share)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {paidCount} of {bill.participants.length} settled
        </span>
        {allPaid && (
          <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
            All Settled
          </span>
        )}
      </div>
    </div>
  )
}
