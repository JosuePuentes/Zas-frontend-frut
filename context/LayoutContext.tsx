'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

const LayoutContext = createContext<{
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}>({ sidebarCollapsed: false, setSidebarCollapsed: () => {} });

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
