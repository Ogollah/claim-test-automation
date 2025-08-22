import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center p-3 gap-7">
      <Header/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-100">
          <div className="px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
