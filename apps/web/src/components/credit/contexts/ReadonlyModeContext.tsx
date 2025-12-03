import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// Default readonly mode from env (true unless explicitly set to 'false')
const DEFAULT_READONLY_MODE = import.meta.env.PUBLIC_READONLY_MODE !== 'false';
const READONLY_MODE_KEY = 'credit-castor-readonly-mode';

function loadReadonlyMode(): boolean {
  try {
    const stored = localStorage.getItem(READONLY_MODE_KEY);
    if (stored === null) {
      return DEFAULT_READONLY_MODE;
    }
    return stored === 'true';
  } catch {
    return DEFAULT_READONLY_MODE;
  }
}

function saveReadonlyMode(isReadonly: boolean): void {
  try {
    localStorage.setItem(READONLY_MODE_KEY, String(isReadonly));
  } catch (error) {
    console.error('Failed to save readonly mode:', error);
  }
}

interface ReadonlyModeContextValue {
  isReadonlyMode: boolean;
  setReadonlyMode: (isReadonly: boolean) => void;
}

const ReadonlyModeContext = createContext<ReadonlyModeContextValue | undefined>(undefined);

/**
 * Provider for readonly mode state - separated from UnlockContext to prevent
 * unnecessary re-renders when toggling between view/edit modes.
 */
export function ReadonlyModeProvider({
  children,
  forceReadonly = false,
}: {
  children: ReactNode;
  forceReadonly?: boolean;
}) {
  const [isReadonlyMode, setIsReadonlyModeState] = useState<boolean>(() => {
    if (forceReadonly) return true;
    return loadReadonlyMode();
  });

  const setReadonlyMode = useCallback((isReadonly: boolean) => {
    setIsReadonlyModeState(isReadonly);
    saveReadonlyMode(isReadonly);
  }, []);

  return (
    <ReadonlyModeContext.Provider value={{ isReadonlyMode, setReadonlyMode }}>
      {children}
    </ReadonlyModeContext.Provider>
  );
}

/**
 * Hook to access readonly mode state.
 * Use this instead of useUnlock() when you only need to check/toggle readonly mode.
 */
export function useReadonlyMode(): ReadonlyModeContextValue {
  const context = useContext(ReadonlyModeContext);

  if (context === undefined) {
    throw new Error('useReadonlyMode must be used within a ReadonlyModeProvider');
  }

  return context;
}
