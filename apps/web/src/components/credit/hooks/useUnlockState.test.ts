import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnlockState, getUnlockState } from './useUnlockState';

describe('useUnlockState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should initialize with locked state', () => {
    const { result } = renderHook(() => useUnlockState());

    expect(result.current.isUnlocked).toBe(false);
    expect(result.current.unlockedAt).toBeNull();
    expect(result.current.unlockedBy).toBeNull();
  });

  it('should unlock without requiring password (just user email)', async () => {
    const { result } = renderHook(() => useUnlockState());

    await act(async () => {
      result.current.unlock('user@example.com');
    });

    expect(result.current.isUnlocked).toBe(true);
    expect(result.current.unlockedBy).toBe('user@example.com');
    expect(result.current.unlockedAt).toBeInstanceOf(Date);
  });

  it('should lock when already unlocked', async () => {
    const { result } = renderHook(() => useUnlockState());

    // First unlock
    await act(async () => {
      result.current.unlock('user@example.com');
    });

    expect(result.current.isUnlocked).toBe(true);

    // Then lock
    await act(async () => {
      await result.current.lock();
    });

    expect(result.current.isUnlocked).toBe(false);
    expect(result.current.unlockedBy).toBeNull();
    expect(result.current.unlockedAt).toBeNull();
  });

  it('should persist unlock state to localStorage', async () => {
    const { result } = renderHook(() => useUnlockState());

    await act(async () => {
      result.current.unlock('user@example.com');
    });

    // Check localStorage
    const stored = localStorage.getItem('credit-castor-unlock-state');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.isUnlocked).toBe(true);
    expect(parsed.unlockedBy).toBe('user@example.com');
    expect(parsed.unlockedAt).toBeTruthy();
  });

  it('should load unlock state from localStorage on init', () => {
    // Manually set localStorage
    const testDate = new Date('2025-01-15T10:00:00Z');
    localStorage.setItem(
      'credit-castor-unlock-state',
      JSON.stringify({
        isUnlocked: true,
        unlockedBy: 'admin@example.com',
        unlockedAt: testDate.toISOString(),
      })
    );

    // Render hook
    const { result } = renderHook(() => useUnlockState());

    expect(result.current.isUnlocked).toBe(true);
    expect(result.current.unlockedBy).toBe('admin@example.com');
    expect(result.current.unlockedAt).toEqual(testDate);
  });

  it('should handle corrupted localStorage gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('credit-castor-unlock-state', 'invalid-json{');

    const { result } = renderHook(() => useUnlockState());

    // Should fall back to locked state
    expect(result.current.isUnlocked).toBe(false);
    expect(result.current.unlockedAt).toBeNull();
    expect(result.current.unlockedBy).toBeNull();
  });

  describe('getUnlockState', () => {
    it('should return current unlock state without hook', () => {
      // Set state in localStorage
      localStorage.setItem(
        'credit-castor-unlock-state',
        JSON.stringify({
          isUnlocked: true,
          unlockedBy: 'test@example.com',
          unlockedAt: new Date().toISOString(),
        })
      );

      const state = getUnlockState();
      expect(state.isUnlocked).toBe(true);
      expect(state.unlockedBy).toBe('test@example.com');
    });

    it('should return locked state if nothing in localStorage', () => {
      const state = getUnlockState();
      expect(state.isUnlocked).toBe(false);
      expect(state.unlockedAt).toBeNull();
      expect(state.unlockedBy).toBeNull();
    });
  });


  it('should maintain state across multiple renders', async () => {
    const { result, rerender } = renderHook(() => useUnlockState());

    await act(async () => {
      result.current.unlock('user@example.com');
    });

    expect(result.current.isUnlocked).toBe(true);

    // Rerender
    rerender();

    // State should still be unlocked
    expect(result.current.isUnlocked).toBe(true);
    expect(result.current.unlockedBy).toBe('user@example.com');
  });
});
