import { ChevronLeft, X } from 'lucide-react';
import { useState } from 'react';

interface CreateLabelMenuProps {
  onClose: () => void;
  onBack: () => void;
}

export function CreateLabelMenu({ onClose, onBack }: CreateLabelMenuProps) {
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-teal-600');

  const colors = [
    // Row 1 - Darker shades
    'bg-emerald-800',
    'bg-yellow-800',
    'bg-orange-800',
    'bg-red-800',
    'bg-purple-800',
    
    // Row 2 - Dark shades
    'bg-emerald-700',
    'bg-yellow-700',
    'bg-orange-700',
    'bg-red-700',
    'bg-purple-700',
    
    // Row 3 - Medium bright
    'bg-emerald-500',
    'bg-yellow-400',
    'bg-orange-500',
    'bg-red-400',
    'bg-purple-400',
    
    // Row 4 - Blues and greens
    'bg-blue-700',
    'bg-teal-700',
    'bg-lime-700',
    'bg-rose-700',
    'bg-gray-600',
    
    // Row 5 - Light blues and pastels
    'bg-blue-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-pink-500',
    'bg-gray-500',
  ];

  const handleCreate = () => {
    console.log('Creating label:', labelName, selectedColor);
    onBack();
  };

  return (
    <div className="bg-[#2b2b2b] rounded-lg shadow-xl w-full max-w-[320px] text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={onBack}
          className="hover:bg-gray-700 p-1 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">Создание метки</h2>
        <button
          onClick={onClose}
          className="hover:bg-gray-700 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className={`${selectedColor} rounded px-3 py-3 min-h-12 mb-4`}>
          {labelName || ' '}
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Название</label>
          <input
            type="text"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-3 block">Цвет</label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`${color} h-10 rounded-md hover:scale-110 transition-transform relative`}
              >
                {selectedColor === color && (
                  <svg
                    className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <button className="w-full text-sm text-gray-400 hover:text-white py-2 flex items-center justify-center gap-2 transition-colors">
            <X className="w-4 h-4" />
            Без цвета
          </button>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium transition-colors"
        >
          Создание
        </button>
      </div>
    </div>
  );
}
