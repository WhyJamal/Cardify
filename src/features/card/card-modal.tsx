import { useState } from "react";
import {
  X,
  Eye,
  MoreHorizontal,
  Image,
  Plus,
  CheckSquare,
  Paperclip,
  AlignLeft,
  MessageSquare,
  Smile,
  ChevronDown,
  Circle,
} from "lucide-react";

interface Comment {
  id: number;
  author: string;
  initials: string;
  text: string;
  date: string;
  isActivity?: boolean;
  activityText?: string;
}

interface CardModalProps {
  onClose: () => void;
}

export function CardModal({ onClose }: CardModalProps) {
  const [comment, setComment] = useState("");
  const [description, setDescription] = useState("Описание");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(description);

  const comments: Comment[] = [
    {
      id: 1,
      author: "M. Jamal",
      initials: "JM",
      text: "comment 1",
      date: "16 июн. 2025 г., 14:06",
    },
    {
      id: 2,
      author: "M. Jamal",
      initials: "JM",
      text: "",
      date: "30 мая 2025 г., 10:09",
      isActivity: true,
      activityText: "добавил(а) эту карточку в список 2",
    },
  ];

  const handleSaveDesc = () => {
    setDescription(tempDesc);
    setIsEditingDesc(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4">
      <div
        className="bg-[#1d2125] top-10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative"
        
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-[#9fadbc] text-sm">
            <span className="bg-[#2c333a] rounded px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-[#38414a]">
              1 <ChevronDown size={13} />
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#9fadbc]">
            <button className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors">
              <Image size={18} />
            </button>
            <button className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors">
              <Eye size={18} />
            </button>
            <button className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors">
              <MoreHorizontal size={18} />
            </button>
            <button
              onClick={onClose}
              className="hover:text-white hover:bg-[#2c333a] p-1.5 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex overflow-y-auto h-full">

          <div className="flex-1 px-6 pb-6 pt-2 min-w-0">
            <div className="flex items-start gap-3 mb-5">
              <div
                className="round-sm top-1.5">               
                <input
                  type="checkbox"
                  id={`checkbox`}
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={`checkbox`}
                  onClick={(e) => e.stopPropagation()}
                >
                </label>
              </div>
              <h2 className="text-white text-xl font-semibold leading-snug">Task 1</h2>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors">
                <Plus size={14} />
                Добавить
              </button>
              <button className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors">
                <CheckSquare size={14} />
                Чек-лист
              </button>
              <button className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors">
                <Paperclip size={14} />
                Вложение
              </button>
            </div>

            <div className="flex gap-6 mb-6 flex-wrap">

              <div>
                <p className="text-[#9fadbc] text-xs mb-2">Участники</p>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold">
                    SG
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#2c333a] hover:bg-[#38414a] flex items-center justify-center text-[#9fadbc] hover:text-white transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[#9fadbc] text-xs mb-2">Метки</p>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-8 rounded bg-[#4bce97]" />
                  <button className="w-8 h-8 rounded bg-[#2c333a] hover:bg-[#38414a] flex items-center justify-center text-[#9fadbc] hover:text-white transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[#9fadbc] text-xs mb-2">Срок</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] text-sm px-3 py-1.5 rounded transition-colors">
                    17 июн. 2025 г., 12:39
                    <span className="bg-[#c9372c] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      Просрочен
                    </span>
                    <ChevronDown size={11} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white">
                  <AlignLeft size={16} className="text-[#9fadbc]" />
                  <span className="text-sm font-medium">Описание</span>
                </div>
                {!isEditingDesc && (
                  <button
                    onClick={() => {
                      setTempDesc(description);
                      setIsEditingDesc(true);
                    }}
                    className="bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                  >
                    Изменить
                  </button>
                )}
              </div>
              {isEditingDesc ? (
                <div className="ml-6">
                  <textarea
                    className="w-full bg-[#22272b] text-[#b6c2cf] text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                    value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveDesc}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditingDesc(false)}
                      className="bg-transparent hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <p className="ml-6 text-[#b6c2cf] text-sm">{description}</p>
              )}
            </div>
          </div>

          <div className="w-112.5 shrink-0 border-l border-[#2c333a] px-5 pb-6 pt-2 bg-[#0f1313]">

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <MessageSquare size={15} className="text-[#9fadbc]" />
                Комментарии и события
              </div>
              <button className="bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                Показать подробности
              </button>
            </div>


            <div className="mb-5">
              <input
                type="text"
                placeholder="Напишите комментарий..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#22272b] text-[#b6c2cf] placeholder-[#596773] text-sm px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4bce97] flex items-center justify-center text-[#1d2125] text-xs font-semibold shrink-0">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    {c.isActivity ? (
                      <p className="text-[#b6c2cf] text-sm leading-snug">
                        <span className="text-white font-medium">{c.author}</span>{" "}
                        {c.activityText}
                      </p>
                    ) : (
                      <>
                        <p className="text-white text-sm font-medium mb-0.5">{c.author}</p>
                        <div className="bg-[#22272b] text-[#b6c2cf] text-sm px-3 py-2 rounded-lg mb-1">
                          {c.text}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#9fadbc]">
                          <Smile size={12} />
                          <span>•</span>
                          <button className="hover:text-white hover:underline transition-colors">
                            Изменить
                          </button>
                          <span>•</span>
                          <button className="hover:text-white hover:underline transition-colors">
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                    <p className="text-[#9fadbc] text-xs mt-0.5 underline decoration-dotted cursor-pointer hover:text-white">
                      {c.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
