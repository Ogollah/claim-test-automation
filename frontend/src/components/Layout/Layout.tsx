'use client';
import { ReactNode } from 'react';

import SessionProviderWrapper from '../SessionProviderWrapper';
import { Session } from "next-auth";
import { Navbar } from './navbar';
import { useStore } from '@/hook/use-store';
import { useSidebar } from '@/hook/use-sidebar';
import { Sidebar } from './sidebar';
import { cn } from "@/lib/utils";
import { Footer } from './footer';

interface LayoutProps {
  children: ReactNode;
  session?: Session | null;
}

export default function Layout({ children, session }: LayoutProps) {

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <SessionProviderWrapper session={session}>
      <div>
        {/* <Navbar title={title} /> */}
        <Sidebar />
        <main
          className={cn(
            "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
            !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
          )}
        >
          {children}
        </main>
        <footer
          className={cn(
            "transition-[margin-left] ease-in-out duration-300 m-t-20 px-3 ",
            !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
          )}
        >
          <Footer />
        </footer>
      </div>
    </SessionProviderWrapper>
  );
}
