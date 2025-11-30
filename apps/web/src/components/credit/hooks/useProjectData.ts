/**
 * React hook for project data management
 *
 * Provides:
 * - Load project data from Supabase
 * - Track local changes (dirty state)
 * - Save changes on explicit action
 * - Discard changes and reload
 * - Unsaved changes warning
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadProject, saveProject, type ProjectData } from '../services/supabaseData';
import type { Participant, ProjectParams, PortageFormulaParams } from '@repo/credit-calculator/utils';

// ============================================
// Types
// ============================================

export interface UseProjectDataOptions {
  projectId: string;
  onLoadError?: (error: string) => void;
  onSaveError?: (error: string) => void;
  onSaveSuccess?: () => void;
}

export interface UseProjectDataReturn {
  // Data
  participants: Participant[];
  projectParams: ProjectParams | null;
  portageFormula: PortageFormulaParams | null;
  deedDate: string;

  // Status
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  error: string | null;

  // Actions
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (index: number, updates: Partial<Participant>) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (index: number) => void;
  setProjectParams: (params: ProjectParams) => void;
  setPortageFormulaParams: (formula: PortageFormulaParams) => void;
  setDeedDate: (date: string) => void;
  save: () => Promise<boolean>;
  discard: () => Promise<void>;
  reload: () => Promise<void>;
}

// ============================================
// Hook Implementation
// ============================================

export function useProjectData({
  projectId,
  onLoadError,
  onSaveError,
  onSaveSuccess,
}: UseProjectDataOptions): UseProjectDataReturn {
  // State
  const [participants, setParticipantsState] = useState<Participant[]>([]);
  const [projectParams, setProjectParamsState] = useState<ProjectParams | null>(null);
  const [portageFormula, setPortageFormulaParamsState] = useState<PortageFormulaParams | null>(null);
  const [deedDate, setDeedDateState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track original data for dirty detection
  const originalData = useRef<ProjectData | null>(null);

  // ============================================
  // Load Data
  // ============================================

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await loadProject(projectId);

    if (result.success && result.data) {
      setParticipantsState(result.data.participants);
      setProjectParamsState(result.data.projectParams);
      setPortageFormulaParamsState(result.data.portageFormula);
      setDeedDateState(result.data.deedDate);
      originalData.current = result.data;
      setIsDirty(false);
    } else {
      const errorMsg = result.error || 'Failed to load project';
      setError(errorMsg);
      onLoadError?.(errorMsg);
    }

    setIsLoading(false);
  }, [projectId, onLoadError]);

  // Load on mount and projectId change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================
  // Unsaved Changes Warning
  // ============================================

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ============================================
  // Update Functions
  // ============================================

  const setParticipants = useCallback((newParticipants: Participant[]) => {
    setParticipantsState(newParticipants);
    setIsDirty(true);
  }, []);

  const updateParticipant = useCallback((index: number, updates: Partial<Participant>) => {
    setParticipantsState(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    setIsDirty(true);
  }, []);

  const addParticipant = useCallback((participant: Participant) => {
    setParticipantsState(prev => [...prev, participant]);
    setIsDirty(true);
  }, []);

  const removeParticipant = useCallback((index: number) => {
    setParticipantsState(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  }, []);

  const setProjectParams = useCallback((params: ProjectParams) => {
    setProjectParamsState(params);
    setIsDirty(true);
  }, []);

  const setPortageFormulaParams = useCallback((formula: PortageFormulaParams) => {
    setPortageFormulaParamsState(formula);
    setIsDirty(true);
  }, []);

  const setDeedDate = useCallback((date: string) => {
    setDeedDateState(date);
    setIsDirty(true);
  }, []);

  // ============================================
  // Save
  // ============================================

  const save = useCallback(async (): Promise<boolean> => {
    if (!projectParams || !portageFormula) {
      onSaveError?.('Project data not loaded');
      return false;
    }

    setIsSaving(true);
    setError(null);

    const data: ProjectData = {
      id: projectId,
      deedDate,
      projectParams,
      portageFormula,
      participants,
    };

    const result = await saveProject(projectId, data);

    setIsSaving(false);

    if (result.success) {
      originalData.current = data;
      setIsDirty(false);
      onSaveSuccess?.();
      return true;
    } else {
      const errorMsg = result.error || 'Failed to save';
      setError(errorMsg);
      onSaveError?.(errorMsg);
      return false;
    }
  }, [projectId, deedDate, projectParams, portageFormula, participants, onSaveSuccess, onSaveError]);

  // ============================================
  // Discard
  // ============================================

  const discard = useCallback(async () => {
    if (originalData.current) {
      setParticipantsState(originalData.current.participants);
      setProjectParamsState(originalData.current.projectParams);
      setPortageFormulaParamsState(originalData.current.portageFormula);
      setDeedDateState(originalData.current.deedDate);
      setIsDirty(false);
    } else {
      await loadData();
    }
  }, [loadData]);

  // ============================================
  // Reload
  // ============================================

  const reload = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    // Data
    participants,
    projectParams,
    portageFormula,
    deedDate,

    // Status
    isLoading,
    isSaving,
    isDirty,
    error,

    // Actions
    setParticipants,
    updateParticipant,
    addParticipant,
    removeParticipant,
    setProjectParams,
    setPortageFormulaParams,
    setDeedDate,
    save,
    discard,
    reload,
  };
}
