/**
 * SaveBar - Floating action bar for Save/Discard operations
 *
 * Appears at the bottom of the screen when there are unsaved changes.
 * Provides clear, prominent Save and Discard buttons.
 */

import { Save, X, AlertCircle } from 'lucide-react';

interface SaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ isDirty, isSaving, error, onSave, onDiscard }: SaveBarProps) {
  // Don't render if no unsaved changes
  if (!isDirty && !error) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 no-print">
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Status message */}
            <div className="flex items-center gap-3">
              {error ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-medium">{error}</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-gray-700 font-medium">
                    Modifications non sauvegardées
                  </span>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onDiscard}
                disabled={isSaving}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>

              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
