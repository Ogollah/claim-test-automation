'use client';

import AutomationHeader from '@/components/Layout/Header';
import { Content } from '@carbon/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <div>
      <AutomationHeader />
      <Content>{children}</Content>
    </div>
  );
}
