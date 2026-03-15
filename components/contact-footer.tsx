'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Mail, MessageSquare, Heart, Github, Twitter, Instagram, Send, CheckCircle } from 'lucide-react'

export function ContactFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending feedback
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
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">SmartSpend</h3>
                <p className="text-xs text-muted-foreground">Track Your Expenses</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The modern expense tracker designed for Gen-Z. Track spending, split bills, 
              and gain insights into your finances with beautiful visualizations.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Reach Us Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Reach Us
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:support@smartspend.app" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p className="text-xs">support@smartspend.app</p>
                </div>
              </a>
              <a 
                href="mailto:feedback@smartspend.app" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Feedback</p>
                  <p className="text-xs">feedback@smartspend.app</p>
                </div>
              </a>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Send Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              Have suggestions or found a bug? We would love to hear from you!
            </p>
            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2">
                  <Send className="h-4 w-4" />
                  Send Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-[450px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Send Us Feedback
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Share your thoughts, suggestions, or report issues.
                  </DialogDescription>
                </DialogHeader>
                {feedbackSent ? (
                  <div className="py-8 flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-success/20">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground text-lg">Thank you!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your feedback has been sent successfully.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedback-name" className="text-foreground font-medium">Name</Label>
                      <Input
                        id="feedback-name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-secondary border-border text-foreground rounded-xl h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback-email" className="text-foreground font-medium">Email</Label>
                      <Input
                        id="feedback-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary border-border text-foreground rounded-xl h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback-message" className="text-foreground font-medium">Message</Label>
                      <Textarea
                        id="feedback-message"
                        placeholder="Tell us what you think..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-secondary border-border text-foreground rounded-xl min-h-[120px] resize-none"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-semibold"
                    >
                      Submit Feedback
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> by SmartSpend Team
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmartSpend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
