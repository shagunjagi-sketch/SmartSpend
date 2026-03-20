'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Mail, MessageSquare, Github, Twitter, Instagram, Send, CheckCircle, Sparkles, Heart } from 'lucide-react'

export function ContactFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackSent(true)
    setTimeout(() => {
      setFeedbackOpen(false)
      setFeedbackSent(false)
      setName('')
      setEmail('')
      setMessage('')
    }, 2000)
  }

  return (
    <footer className="relative border-t border-primary/10 bg-gradient-to-b from-background via-primary/5 to-background backdrop-blur-xl">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 backdrop-blur-sm bg-card/30 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">SmartSpend</h3>
                <p className="text-xs text-muted-foreground">Track Your Expenses</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The modern expense tracker designed for students. Track spending, split bills, and gain insights into your finances with beautiful visualizations.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all hover:scale-110 text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all hover:scale-110 text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all hover:scale-110 text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 backdrop-blur-sm bg-card/30 rounded-3xl p-6 border border-white/10">
            <h4 className="font-semibold text-foreground text-base flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Transactions</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Split Bills</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Contact & Feedback */}
          <div className="space-y-4 backdrop-blur-sm bg-card/30 rounded-3xl p-6 border border-white/10">
            <h4 className="font-semibold text-foreground text-base flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-accent" />
              Get In Touch
            </h4>
            <div className="space-y-3">
              <a href="mailto:support@smartspend.app" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                support@smartspend.app
              </a>
              <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group w-full">
                    <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Share Feedback
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-[450px] rounded-3xl shadow-2xl">
                  {!feedbackSent ? (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-accent" />
                          We Love Your Feedback
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Help us improve SmartSpend with your thoughts and suggestions.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitFeedback} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground text-sm font-medium">Your Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-secondary/50 border-white/10 text-foreground rounded-xl h-11 backdrop-blur-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground text-sm font-medium">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-secondary/50 border-white/10 text-foreground rounded-xl h-11 backdrop-blur-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-foreground text-sm font-medium">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us what you think..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-secondary/50 border-white/10 text-foreground rounded-xl min-h-32 backdrop-blur-sm resize-none"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-xl h-11 font-semibold hover:shadow-lg transition-all"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Feedback
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center animate-bounce">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-foreground font-semibold text-lg">Thank You!</h3>
                      <p className="text-muted-foreground text-center text-sm">
                        We appreciate your feedback and will review it shortly.
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; 2024 SmartSpend. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
