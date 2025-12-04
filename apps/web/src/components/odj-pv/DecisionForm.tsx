import { useState } from 'react';
import type { ImpactLevel } from '../../types/odj-pv';
import { IMPACT_LABELS } from '../../types/odj-pv';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DecisionFormProps {
  agendaItemId: string | null;
  onSave: (content: string, impactLevel: ImpactLevel) => Promise<void>;
  onCancel: () => void;
}

export function DecisionForm({ agendaItemId, onSave, onCancel }: DecisionFormProps) {
  const [content, setContent] = useState('');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>('medium_term');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await onSave(content, impactLevel);
      setContent('');
      setImpactLevel('medium_term');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Nouvelle Décision</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="decision-content">Contenu de la décision</Label>
            <textarea
              id="decision-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-3 border-2 border-gray-300 rounded-md focus:border-magenta focus:ring-0"
              placeholder="Décrivez la décision prise..."
              required
            />
          </div>

          <div>
            <Label htmlFor="impact-level">Niveau d'impact</Label>
            <select
              id="impact-level"
              value={impactLevel}
              onChange={(e) => setImpactLevel(e.target.value as ImpactLevel)}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-magenta focus:ring-0"
            >
              <option value="long_term">{IMPACT_LABELS.long_term}</option>
              <option value="medium_term">{IMPACT_LABELS.medium_term}</option>
              <option value="daily">{IMPACT_LABELS.daily}</option>
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
              disabled={isSaving || !content.trim()}
              className="bg-magenta hover:bg-magenta-dark text-white"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
