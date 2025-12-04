import { useState } from 'react';
import type { AgendaItem } from '../../types/odj-pv';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AgendaEditorProps {
  meetingId: string;
  items: AgendaItem[];
  onItemsChange: (items: AgendaItem[]) => void;
  onSave: () => Promise<void>;
}

export function AgendaEditor({ meetingId, items, onItemsChange, onSave }: AgendaEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalMinutes = items.reduce((sum, item) => sum + item.duration_minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    const reorderedItems = newItems.map((item, idx) => ({
      ...item,
      position: idx,
    }));

    onItemsChange(reorderedItems);
    setDraggedIndex(index);
  };

  const handleDrop = () => {
    setDraggedIndex(null);
  };

  const handleAddItem = () => {
    const newItem: AgendaItem = {
      id: `temp-${Date.now()}`,
      meeting_id: meetingId,
      position: items.length,
      title: '',
      responsible: null,
      duration_minutes: 15,
      methodology: null,
      notes: null,
      created_at: new Date().toISOString(),
    };
    onItemsChange([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    const reorderedItems = newItems.map((item, idx) => ({
      ...item,
      position: idx,
    }));
    onItemsChange(reorderedItems);
  };

  const handleUpdateItem = (index: number, updates: Partial<AgendaItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onItemsChange(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-rich-black">ORDRE DU JOUR</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            Durée totale: <span className="text-magenta font-bold">{hours}h{minutes.toString().padStart(2, '0')}</span>
          </span>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="nature"
            size="sm"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun sujet à l'ordre du jour. Cliquez sur "+ Ajouter un sujet" pour commencer.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              className={`flex items-center gap-2 p-3 border-2 rounded-lg bg-white transition-all ${
                draggedIndex === index
                  ? 'border-magenta shadow-lg opacity-50'
                  : 'border-gray-300 hover:border-magenta'
              }`}
            >
              <span
                className="cursor-move text-gray-400 hover:text-magenta text-xl select-none"
                title="Glisser pour réorganiser"
              >
                ☰
              </span>

              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={item.title}
                  onChange={(e) => handleUpdateItem(index, { title: e.target.value })}
                  placeholder="Titre du sujet"
                  className="flex-1"
                />
              </div>

              <Input
                value={item.responsible || ''}
                onChange={(e) => handleUpdateItem(index, { responsible: e.target.value || null })}
                placeholder="Qui?"
                className="w-32"
              />

              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={item.duration_minutes}
                  onChange={(e) => handleUpdateItem(index, {
                    duration_minutes: Math.max(1, parseInt(e.target.value) || 15)
                  })}
                  min="1"
                  className="w-20 text-right"
                />
                <span className="text-sm text-gray-600">min</span>
              </div>

              <Input
                value={item.methodology || ''}
                onChange={(e) => handleUpdateItem(index, { methodology: e.target.value || null })}
                placeholder="Méthodo"
                className="w-32"
              />

              <Button
                onClick={() => handleDeleteItem(index)}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                title="Supprimer"
              >
                ✕
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={handleAddItem}
          variant="outline"
          className="w-full border-2 border-dashed border-magenta text-magenta hover:bg-magenta/10"
        >
          + Ajouter un sujet
        </Button>
      </div>
    </div>
  );
}
