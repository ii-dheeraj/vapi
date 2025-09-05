import React from 'react'
import './globals.css'
import ClientProvider from '../components/ClientProvider'

export const metadata = {
  title: 'AI Interview Avatar',
  description: 'LiveKit + Tavus powered interview assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-app-gradient text-white min-h-screen">
        <ClientProvider>
          <header className="sticky top-0 z-20">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-brand-500/20 border border-brand-400/30 grid place-items-center shadow-soft">
                  <span className="text-brand-200 font-bold">AI</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold leading-tight">Interview Avatar</h1>
                  <p className="text-xs text-white/70 -mt-0.5">Powered by LiveKit • Tavus • Google</p>
                </div>
              </div>
              <nav className="flex items-center gap-2">
                <a href="/interview/demo" className="btn-secondary">Demo Room</a>
                <a href="/interview/interview-room" className="btn-primary">Start Interview</a>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </main>

          <footer className="mt-16 py-8 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
              © {new Date().getFullYear()} Interview Avatar. All rights reserved.
            </div>
          </footer>
        </ClientProvider>
      </body>
    </html>
  )
}
