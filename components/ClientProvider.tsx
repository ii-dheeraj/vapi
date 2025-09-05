"use client";
import { DailyProvider } from '@daily-co/daily-react';
import { ReactNode } from 'react';

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <DailyProvider>{children}</DailyProvider>;
}
