'use client'

import { Mail, Github, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactFooter() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground">SmartSpend</h3>
            <p className="text-sm text-muted-foreground">Track your expenses and master your finances.</p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Product</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Contact</h4>
            <p className="text-sm text-muted-foreground">hello@smartspend.app</p>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <p className="text-sm text-muted-foreground">© 2024 SmartSpend. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
