"use client";

import { ReactNode } from "react";
import { Kbd } from "@components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { cn } from "@/lib/utils";

type TooltipActionProps = {
  children: ReactNode;

  tooltip?: string;

  shortcut?: string;

  className?: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function TooltipAction({
  children,
  tooltip,
  shortcut,
  className,
  side = "right",
}: TooltipActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>        
          {children}
      </TooltipTrigger>

      <TooltipContent side={side} align="center" sideOffset={10}>
        <span className={cn(`flex items-center gap-2 ${className}`)}>
          {tooltip}
          {shortcut && <Kbd>{shortcut}</Kbd>}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}