"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, X } from "lucide-react";
import { Column, BottomNav, ColumnDragPreview } from "@/shared/components";
import { CardDragPreview } from "@/shared/components/card-drag-preview";
import { useBoardView } from "@/app/providers/BoardProvider";
import { useBoardActions } from "@/shared/hooks/useBoardActions";

export default function BoardPage() {
  const { board, columns } = useBoardView();
  const { dropCard, addCard, dropColumn, addColumn } = useBoardActions();

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  async function handleAddColumn() {
    const ok = await addColumn(newColumnTitle);
    if (ok) {
      setNewColumnTitle("");
      setAddingColumn(false);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ColumnDragPreview columns={columns} />
      <CardDragPreview columns={columns} />
      
      <div
        className="h-screen w-screen flex flex-col overflow-hidden"
        style={{
          background: board
            ? board.isPhoto
              ? `url(${board.bg}) center/cover no-repeat`
              : board.bg
            : "linear-gradient(135deg, #2c3e50 0%, #1a2533 100%)",
        }}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-3 pb-20 hide-scroll">
          <div className="flex items-start gap-3 h-full min-w-max mt-11">

            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                onAddCard={addCard}
                onDropCard={dropCard}
                onDropColumn={dropColumn}
              />
            ))}

            {addingColumn ? (
              <div className="shrink-0 w-64 bg-[#101204] rounded-xl p-2 shadow-lg">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn();
                    if (e.key === "Escape") {
                      setAddingColumn(false);
                      setNewColumnTitle("");
                    }
                  }}
                  placeholder="Введите заголовок списка..."
                  className="w-full bg-[#22272b] border border-[#3d4954] rounded px-3 py-2 text-[#b6c2cf] text-sm outline-none focus:border-[#388bff] mb-2"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="bg-[#579dff] hover:bg-[#388bff] text-[#1d2125] text-sm font-medium px-3 py-1.5 rounded transition-colors"
                  >
                    Добавить список
                  </button>
                  <button
                    onClick={() => { setAddingColumn(false); setNewColumnTitle(""); }}
                    className="text-[#9fadbc] hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className={`shrink-0 w-64 flex items-center gap-2 px-3 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium transition-all border border-black/15 ${
                  board?.isPhoto ? "text-fuchsia-950 hover:bg-white/5" : "text-white hover:bg-white/30"
                }`}
              >
                <Plus size={16} />
                Добавить список
              </button>
            )}

          </div>
        </div>
        <BottomNav />
      </div>
    </DndProvider>
  );
}