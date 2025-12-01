/**
 * EditModeToolbar - Collapsible floating action button for edit controls
 *
 * Design patterns applied:
 * - FAB (Floating Action Button) pattern - minimal footprint, expandable
 * - Bottom-right positioning - standard for actions, doesn't obscure content
 * - High z-index (z-[60]) - visible above modals (z-50)
 * - Responsive - works on all screen sizes without overlap
 */

import { Eye, Edit3, Lock, Unlock, Save, X, AlertCircle, ChevronUp, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUnlock } from '../contexts/UnlockContext';

interface EditModeToolbarProps {
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onDiscard: () => void;
}

function PasswordPromptDialog({
  onSubmit,
  onCancel,
}: {
  onSubmit: (password: string, email: string) => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!password.trim()) {
      setError('Veuillez entrer le mot de passe');
      return;
    }

    onSubmit(password, email);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Déverrouiller les champs collectifs
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="unlock-email" className="block text-sm font-medium text-gray-700 mb-1">
                Votre email
              </label>
              <input
                id="unlock-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre-email@exemple.com"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="unlock-password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe administrateur
              </label>
              <input
                id="unlock-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm">
              <p>
                Le déverrouillage permet de modifier les paramètres collectifs du projet
                (prix d'achat, frais généraux, formule de portage, etc.).
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Déverrouiller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditModeToolbar({ isDirty, isSaving, error, onSave, onDiscard }: EditModeToolbarProps) {
  const {
    isReadonlyMode,
    setReadonlyMode,
    isForceReadonly,
    isUnlocked,
    unlockedBy,
    unlockedAt,
    unlock,
    lock,
  } = useUnlock();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Auto-expand when there are unsaved changes
  useEffect(() => {
    if (isDirty || error) {
      setIsExpanded(true);
    }
  }, [isDirty, error]);

  // Hide entirely for unauthenticated users
  if (isForceReadonly) {
    return null;
  }

  const handleModeToggle = () => {
    if (isReadonlyMode) {
      const confirmed = window.confirm(
        'Voulez-vous activer le mode édition ?\n\nCela permettra de modifier les données.'
      );
      if (confirmed) {
        setReadonlyMode(false);
      }
    } else {
      setReadonlyMode(true);
    }
  };

  const handleUnlockAttempt = async (password: string, email: string) => {
    const success = await unlock(password, email);
    if (success) {
      setShowPasswordPrompt(false);
      setUnlockError(null);
    } else {
      setUnlockError('Mot de passe incorrect');
    }
  };

  const handleLockToggle = () => {
    if (isUnlocked) {
      lock();
      setUnlockError(null);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const showSaveActions = !isReadonlyMode && (isDirty || error);

  // Determine FAB color based on state
  const getFabColor = () => {
    if (error) return 'bg-red-500 hover:bg-red-600';
    if (isDirty) return 'bg-amber-500 hover:bg-amber-600';
    if (!isReadonlyMode) return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-gray-500 hover:bg-gray-600';
  };

  const getFabIcon = () => {
    if (error) return <AlertCircle className="w-6 h-6" />;
    if (isDirty) return <Save className="w-6 h-6" />;
    if (!isReadonlyMode) return <Edit3 className="w-6 h-6" />;
    return <Eye className="w-6 h-6" />;
  };

  return (
    <>
      {/* FAB Container - Bottom right, above modals */}
      <div className="fixed bottom-6 right-6 z-[60] no-print flex flex-col items-end gap-3">
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-72 animate-in slide-in-from-bottom-2 duration-200">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contrôles d'édition
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Réduire"
              >
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={handleModeToggle}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isReadonlyMode
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                  }
                `}
                title={
                  isReadonlyMode
                    ? 'Mode lecture seule - Cliquez pour éditer'
                    : 'Mode édition actif'
                }
              >
                <div className="flex items-center gap-3">
                  {isReadonlyMode ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <Edit3 className="w-5 h-5" />
                  )}
                  <span>{isReadonlyMode ? 'Lecture seule' : 'Mode édition'}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${isReadonlyMode ? 'bg-gray-400' : 'bg-blue-500'}`} />
              </button>
            </div>

            {/* Unlock Section - Only visible in edit mode */}
            {!isReadonlyMode && (
              <div className="p-3 border-b border-gray-100">
                <button
                  onClick={handleLockToggle}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isUnlocked
                      ? 'bg-green-50 text-green-700 ring-2 ring-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  title={
                    isUnlocked
                      ? `Déverrouillé par ${unlockedBy} le ${unlockedAt?.toLocaleString('fr-BE')}`
                      : 'Cliquez pour déverrouiller les valeurs générales'
                  }
                >
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    <span>{isUnlocked ? 'Valeurs déverrouillées' : 'Valeurs verrouillées'}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-400'}`} />
                </button>
                {unlockError && (
                  <div className="mt-2 text-xs text-red-600 px-2">{unlockError}</div>
                )}
              </div>
            )}

            {/* Save/Discard Section */}
            {showSaveActions && (
              <div className="p-3 bg-amber-50">
                <div className="flex items-center gap-2 mb-3 px-1">
                  {error ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs text-red-600 font-medium">{error}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                      <span className="text-xs text-amber-700 font-medium">
                        Modifications non sauvegardées
                      </span>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onDiscard}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAB Button - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all
            ${getFabColor()}
            ${isDirty ? 'animate-pulse' : ''}
          `}
          title={isExpanded ? 'Réduire les contrôles' : 'Afficher les contrôles d\'édition'}
        >
          {isExpanded ? (
            <Settings className="w-6 h-6" />
          ) : (
            getFabIcon()
          )}
        </button>

        {/* Quick indicator badge when collapsed with unsaved changes */}
        {!isExpanded && isDirty && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
        )}
      </div>

      {showPasswordPrompt && (
        <PasswordPromptDialog
          onSubmit={handleUnlockAttempt}
          onCancel={() => {
            setShowPasswordPrompt(false);
            setUnlockError(null);
          }}
        />
      )}
    </>
  );
}
