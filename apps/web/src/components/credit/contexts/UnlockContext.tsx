import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useUnlockState, type UnlockState } from '../hooks/useUnlockState';
import { ReadonlyModeProvider, useReadonlyMode } from './ReadonlyModeContext';

// Re-export for convenience
export { useReadonlyMode } from './ReadonlyModeContext';

/**
 * Context value for unlock state only (no readonly mode).
 * This is the optimized context that won't re-render when readonly mode changes.
 */
interface UnlockContextValue extends UnlockState {
  unlock: (userEmail: string) => void;
  lock: () => Promise<void>;
  isLoading: boolean;
  /** Whether readonly mode is forced (user cannot toggle) */
  isForceReadonly: boolean;
}

const UnlockContext = createContext<UnlockContextValue | undefined>(undefined);

/**
 * Internal provider for unlock state only.
 */
function UnlockProviderInner({
  children,
  forceReadonly = false,
}: {
  children: ReactNode;
  forceReadonly?: boolean;
}) {
  const unlockState = useUnlockState();

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...unlockState,
    isForceReadonly: forceReadonly,
  }), [unlockState, forceReadonly]);

  return (
    <UnlockContext.Provider value={contextValue}>
      {children}
    </UnlockContext.Provider>
  );
}

/**
 * Provider component that makes unlock state available to all child components.
 *
 * @param forceReadonly - When true, forces readonly mode and prevents toggling (for unauthenticated users)
 */
export function UnlockProvider({
  children,
  projectId: _projectId = 'default',
  forceReadonly = false,
}: {
  children: ReactNode;
  projectId?: string;
  forceReadonly?: boolean;
}) {
  return (
    <ReadonlyModeProvider forceReadonly={forceReadonly}>
      <UnlockProviderInner forceReadonly={forceReadonly}>
        {children}
      </UnlockProviderInner>
    </ReadonlyModeProvider>
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
 *     unlock('user@example.com');
 *     console.log('Unlocked!');
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
