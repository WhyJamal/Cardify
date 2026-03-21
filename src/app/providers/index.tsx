"use client";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AuthProvider } from "@/app/providers/AuthProvider";

type ProvidersProps = {
  children: React.ReactNode;
  session?: any;
};

export function AppProviders({ children, session }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <AuthProvider session={session}>
        {children}
      </AuthProvider>
    </TooltipProvider>
  );
}