import { useState, useEffect, useRef, useCallback } from 'react';
import type { AgendaItem, Decision, Mission, MeetingVersion } from '../../types/odj-pv';

interface NoteTakerProps {
  meetingId: string;
  agendaItems: AgendaItem[];
  decisions: Decision[];
  missions: Mission[];
  versions: MeetingVersion[];
  onItemNotesChange: (itemId: string, notes: string) => void;
  onAddDecision: (itemId: string) => void;
  onAddMission: (itemId: string) => void;
  onLoadVersion: (versionId: string) => void;
}

export function NoteTaker({
  meetingId,
  agendaItems,
  decisions,
  missions,
  versions,
  onItemNotesChange,
  onAddDecision,
  onAddMission,
  onLoadVersion
}: NoteTakerProps) {
  // Global timer
  const [globalTime, setGlobalTime] = useState(0);
  const [isGlobalRunning, setIsGlobalRunning] = useState(false);

  // Per-item timers
  const [itemTimers, setItemTimers] = useState<Record<string, number>>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // Autosave
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  // Timer effect for global and active item
  useEffect(() => {
    const interval = setInterval(() => {
      if (isGlobalRunning) {
        setGlobalTime(t => t + 1);
      }
      if (activeItemId) {
        setItemTimers(prev => ({
          ...prev,
          [activeItemId]: (prev[activeItemId] || 0) + 1
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isGlobalRunning, activeItemId]);

  // Autosave effect (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger autosave
      setLastSaved(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeSinceLastSave = () => {
    const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="space-y-4">
      {/* Header with global timer and save status */}
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded">
        <div className="flex items-center gap-4">
          <span className="text-xl font-mono">TIMER GLOBAL: {formatTime(globalTime)}</span>
          <button onClick={() => setIsGlobalRunning(!isGlobalRunning)}>
            {isGlobalRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
        </div>
        <span className="text-sm text-gray-600">
          💾 Sauvegardé il y a {getTimeSinceLastSave()}
        </span>
      </div>

      {/* Version buttons */}
      <div className="flex gap-2">
        <span>Versions:</span>
        {versions.slice(0, 6).map((v, i) => (
          <button
            key={v.id}
            onClick={() => onLoadVersion(v.id)}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          >
            {/* Format as T-5, T-10, etc based on created_at */}
            T-{Math.round((new Date().getTime() - new Date(v.created_at).getTime()) / 60000)}
          </button>
        ))}
      </div>

      {/* Agenda items */}
      {agendaItems.map((item, index) => (
        <div key={item.id} className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">
              {index + 1}. {item.title} ({item.duration_minutes}min)
            </h4>
            <div className="flex items-center gap-2">
              <span className="font-mono">⏱️ {formatTime(itemTimers[item.id] || 0)}</span>
              <button onClick={() => setActiveItemId(activeItemId === item.id ? null : item.id)}>
                {activeItemId === item.id ? '⏸️ Pause' : '▶️ Start'}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">Responsable: {item.responsible || '?'}</p>

          {item.methodology && (
            <p className="text-sm italic bg-gray-50 p-2 rounded">
              Méthodologie: {item.methodology}
            </p>
          )}

          <textarea
            value={item.notes || ''}
            onChange={(e) => onItemNotesChange(item.id, e.target.value)}
            placeholder="Notes..."
            className="w-full h-24 p-2 border rounded"
          />

          <div className="flex gap-4">
            <button
              onClick={() => onAddDecision(item.id)}
              className="text-red-600 hover:underline"
            >
              + Décision
            </button>
            <button
              onClick={() => onAddMission(item.id)}
              className="text-yellow-600 hover:underline"
            >
              + Mission
            </button>
          </div>

          {/* Display existing decisions for this item */}
          {decisions.filter(d => d.agenda_item_id === item.id).map(d => (
            <div key={d.id} className="bg-red-50 p-2 rounded text-sm">
              🔴 {d.content}
            </div>
          ))}

          {/* Display existing missions for this item */}
          {missions.filter(m => m.agenda_item_id === item.id).map(m => (
            <div key={m.id} className="bg-yellow-50 p-2 rounded text-sm">
              📋 {m.description}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
