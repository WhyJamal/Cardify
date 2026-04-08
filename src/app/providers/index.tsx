"use client";

import { TooltipProvider } from "@components/ui/tooltip";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { WorkspaceProvider } from "./WorkspaceProvider";

type ProvidersProps = {
  children: React.ReactNode;
  session?: any;
};

export function AppProviders({ children, session }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <AuthProvider session={session}>
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}