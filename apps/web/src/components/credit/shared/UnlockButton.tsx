import { Lock, Unlock } from 'lucide-react';
import { useUnlock } from '../contexts/UnlockContext';

interface UnlockButtonProps {
  /** Email of the current authenticated admin user */
  userEmail?: string;
}

/**
 * Button to lock/unlock collective fields.
 *
 * Usage:
 * ```tsx
 * import { UnlockButton } from './components/shared/UnlockButton';
 *
 * function App() {
 *   return (
 *     <UnlockProvider>
 *       <UnlockButton userEmail="admin@example.com" />
 *       <YourApp />
 *     </UnlockProvider>
 *   );
 * }
 * ```
 */
export function UnlockButton({ userEmail = 'admin' }: UnlockButtonProps) {
  const {
    isUnlocked,
    unlockedBy,
    unlockedAt,
    unlock,
    lock,
    isReadonlyMode,
  } = useUnlock();

  const handleToggle = () => {
    if (isUnlocked) {
      lock();
    } else {
      const confirmed = window.confirm(
        'Voulez-vous déverrouiller les valeurs générales ?\n\n' +
        'Cela permettra de modifier les paramètres collectifs du projet ' +
        '(prix d\'achat, frais généraux, formule de portage, etc.).\n\n' +
        'Ces modifications affecteront tous les participants.'
      );
      if (confirmed) {
        unlock(userEmail);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isReadonlyMode}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
        ${isReadonlyMode
          ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
          : isUnlocked
            ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
        }
      `}
      title={
        isReadonlyMode
          ? 'Désactivez le mode lecture seule pour déverrouiller'
          : isUnlocked
            ? `Déverrouillé par ${unlockedBy} le ${unlockedAt?.toLocaleString('fr-BE')}`
            : 'Cliquez pour déverrouiller les valeurs générales'
      }
    >
      {isUnlocked ? (
        <>
          <Unlock className="w-4 h-4" />
          <span>Verrouiller valeurs générales</span>
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          <span>Déverrouiller valeurs générales</span>
        </>
      )}
    </button>
  );
}
