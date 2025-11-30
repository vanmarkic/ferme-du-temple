import { createContext, useContext, type ReactNode } from 'react';
import { useUnlockState, type UnlockState } from '../hooks/useUnlockState';

/**
 * Context value including the unlock state and control methods.
 */
interface UnlockContextValue extends UnlockState {
  unlock: (password: string, userEmail: string) => Promise<boolean>;
  lock: () => Promise<void>;
  validatePassword: (password: string) => boolean;
  setReadonlyMode: (isReadonly: boolean) => void;
  isLoading: boolean;
  /** Whether readonly mode is forced (user cannot toggle) */
  isForceReadonly: boolean;
}

const UnlockContext = createContext<UnlockContextValue | undefined>(undefined);

/**
 * Provider component that makes unlock state available to all child components.
 *
 * @param forceReadonly - When true, forces readonly mode and prevents toggling (for unauthenticated users)
 */
export function UnlockProvider({
  children,
  projectId = 'default',
  forceReadonly = false,
}: {
  children: ReactNode;
  projectId?: string;
  forceReadonly?: boolean;
}) {
  const unlockState = useUnlockState(projectId, forceReadonly);

  return (
    <UnlockContext.Provider value={{ ...unlockState, isForceReadonly: forceReadonly }}>
      {children}
    </UnlockContext.Provider>
  );
}

/**
 * Hook to access the unlock state from any component.
 *
 * Must be used within an UnlockProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isUnlocked, unlock, lock } = useUnlock();
 *
 *   const handleUnlock = () => {
 *     const success = unlock('password123', 'user@example.com');
 *     if (success) {
 *       console.log('Unlocked!');
 *     }
 *   };
 *
 *   return <div>{isUnlocked ? 'Unlocked' : 'Locked'}</div>;
 * }
 * ```
 */
export function useUnlock(): UnlockContextValue {
  const context = useContext(UnlockContext);

  if (context === undefined) {
    throw new Error('useUnlock must be used within an UnlockProvider');
  }

  return context;
}
