"use client";

import { Star } from "lucide-react";
import { Toggle } from "@components/ui/toggle";
import { useState } from "react";

interface ToggleChoosenProps {
  boardId: number;
  onToggle: (boardId: number, isChoosen: boolean) => void;
  initialPressed: boolean;
}

export default function ToggleChoosen({
  boardId,
  onToggle,
  initialPressed
}: ToggleChoosenProps) {

  const [pressed, setPressed] = useState<boolean>(initialPressed ?? false);

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleToggle = (value: boolean) => {
    setPressed(value);
    onToggle(boardId, value);
  };

  return (
    <div onClick={stop} onMouseDown={stop}>
      <Toggle
        aria-label="Toggle choosen"
        size="lg"
        variant="default"
        pressed={pressed}
        onPressedChange={handleToggle}
        className="group bg-black/50 rounded mt-1 opacity-0 group-hover:opacity-100 hover:bg-black/40 hover:ring-1 ring-white"
      >
        <Star className="text-yellow-300 group-data-[state=on]:fill-yellow-300" />
      </Toggle>
    </div>
  );
}