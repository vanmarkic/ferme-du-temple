import { useState } from 'react';
import type { Member } from '../../types/odj-pv';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface MissionFormProps {
  agendaItemId: string | null;
  members: Member[];
  onSave: (description: string, memberId: string | null) => Promise<void>;
  onCancel: () => void;
}

export function MissionForm({ agendaItemId, members, onSave, onCancel }: MissionFormProps) {
  const [description, setDescription] = useState('');
  const [memberId, setMemberId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSaving(true);
    try {
      await onSave(description, memberId);
      setDescription('');
      setMemberId(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Nouvelle Mission</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mission-description">Description de la mission</Label>
            <textarea
              id="mission-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 p-3 border-2 border-gray-300 rounded-md focus:border-magenta focus:ring-0"
              placeholder="Décrivez la mission à accomplir..."
              required
            />
          </div>

          <div>
            <Label htmlFor="mission-member">Attribuer à (optionnel)</Label>
            <select
              id="mission-member"
              value={memberId || ''}
              onChange={(e) => setMemberId(e.target.value || null)}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-magenta focus:ring-0"
            >
              <option value="">-- Non assigné --</option>
              {members.filter(m => m.active).map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !description.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
