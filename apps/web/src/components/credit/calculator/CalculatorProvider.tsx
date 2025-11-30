/**
 * Calculator Provider - Data management layer for the calculator
 *
 * Features:
 * - Explicit Save/Discard buttons (no auto-save)
 * - Unsaved changes warning
 * - Supabase data persistence with fallback to defaults
 */

import { type ReactNode, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  calculateAll,
  DEFAULT_PORTAGE_FORMULA,
  exportCalculations,
  XlsxWriter,
  generateParticipantSnapshots,
  downloadScenarioFile,
  createFileUploadHandler,
  DEFAULT_PARTICIPANTS,
  DEFAULT_PROJECT_PARAMS,
  DEFAULT_DEED_DATE,
  syncSoldDatesFromPurchaseDetails,
  type Participant,
  type ProjectParams,
  type PortageFormulaParams,
} from '@repo/credit-calculator/utils';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { useParticipantOperations } from '../hooks/useParticipantOperations';
import { CalculatorContext, type CalculatorContextValue } from '../contexts/CalculatorContext';
import { loadProject, saveProject } from '../services/supabaseData';
import { isSupabaseConfigured } from '../services/supabase';
import toast from 'react-hot-toast';

interface CalculatorProviderProps {
  children: ReactNode;
  projectId?: string; // Optional project ID, defaults to 'default'
}

const unitDetails = {
  1: { casco: 178080, parachevements: 56000 },
  3: { casco: 213060, parachevements: 67000 },
  5: { casco: 187620, parachevements: 59000 },
  6: { casco: 171720, parachevements: 54000 }
};

// Simple notification component
function SimpleToast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      fontSize: '14px'
    }}>
      {message}
    </div>
  );
}

export function CalculatorProvider({ children, projectId = 'default' }: CalculatorProviderProps) {
  // Core state management
  const state = useCalculatorState();
  const {
    participants,
    projectParams,
    deedDate,
    portageFormula,
    pinnedParticipant,
    fullscreenParticipantIndex,
    versionMismatch,
    isInitialized,
    setParticipants,
    setProjectParams,
    setDeedDate,
    setPortageFormula,
    setFullscreenParticipantIndex,
    setVersionMismatch,
    setIsInitialized,
    handlePinParticipant,
    handleUnpinParticipant,
    participantRefs
  } = state;

  // Track data loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Keep track of original data for discard
  const originalDataRef = useRef<{
    participants: Participant[];
    projectParams: ProjectParams;
    deedDate: string;
    portageFormula: PortageFormulaParams;
  } | null>(null);

  // Participant operations
  const participantOps = useParticipantOperations();

  // File input ref for scenario upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on mount
  useEffect(() => {
    let mounted = true;

    async function initializeData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        if (!isSupabaseConfigured()) {
          // Fall back to defaults if Supabase not configured
          console.warn('Supabase not configured, using defaults');
          const defaults = {
            participants: DEFAULT_PARTICIPANTS,
            projectParams: DEFAULT_PROJECT_PARAMS,
            deedDate: DEFAULT_DEED_DATE,
            portageFormula: DEFAULT_PORTAGE_FORMULA
          };
          setParticipants(defaults.participants);
          setProjectParams(defaults.projectParams);
          setDeedDate(defaults.deedDate);
          setPortageFormula(defaults.portageFormula);
          originalDataRef.current = defaults;
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        const result = await loadProject(projectId);

        if (!mounted) return;

        if (result.success && result.data) {
          // supabaseData.ts returns properly typed Participant[] with defaults
          const processedParticipants = syncSoldDatesFromPurchaseDetails(
            result.data.participants.map((p) => ({
              ...p,
              // Ensure entryDate defaults to deedDate if not set
              entryDate: p.entryDate || new Date(result.data!.deedDate),
            }))
          );

          // Initialize renovationStartDate if not present
          const renovationStartDate = result.data.projectParams.renovationStartDate || (() => {
            const deedDateObj = new Date(result.data.deedDate);
            deedDateObj.setFullYear(deedDateObj.getFullYear() + 1);
            return deedDateObj.toISOString().split('T')[0];
          })();

          // supabaseData already applies defaults, just add renovationStartDate if missing
          const projectParamsWithRenovationDate: ProjectParams = {
            ...result.data.projectParams,
            renovationStartDate
          };

          setParticipants(processedParticipants);
          setProjectParams(projectParamsWithRenovationDate);
          setDeedDate(result.data.deedDate);
          setPortageFormula(result.data.portageFormula);
          setIsInitialized(true);
          setLastSyncedAt(new Date());

          // Store original data for discard
          originalDataRef.current = {
            participants: processedParticipants,
            projectParams: projectParamsWithRenovationDate,
            deedDate: result.data.deedDate,
            portageFormula: result.data.portageFormula
          };

          console.log('✅ Data loaded from Supabase');
        } else if (result.error === 'Project not found') {
          // New project - use defaults
          console.log('Project not found, using defaults');
          const defaults = {
            participants: DEFAULT_PARTICIPANTS,
            projectParams: DEFAULT_PROJECT_PARAMS,
            deedDate: DEFAULT_DEED_DATE,
            portageFormula: DEFAULT_PORTAGE_FORMULA
          };
          setParticipants(defaults.participants);
          setProjectParams(defaults.projectParams);
          setDeedDate(defaults.deedDate);
          setPortageFormula(defaults.portageFormula);
          originalDataRef.current = defaults;
          setIsInitialized(true);
        } else {
          setLoadError(result.error || 'Unknown error');
          console.error('❌ Failed to load data:', result.error);
        }
      } catch (error) {
        if (!mounted) return;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setLoadError(errorMessage);
        console.error('❌ Error during data initialization:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeData();

    return () => {
      mounted = false;
    };
  }, [projectId, setParticipants, setProjectParams, setDeedDate, setPortageFormula, setIsInitialized]);

  // Mark dirty when data changes (after initialization)
  const prevDataRef = useRef<string>('');
  useEffect(() => {
    if (!isInitialized) return;

    const currentData = JSON.stringify({ participants, projectParams, deedDate, portageFormula });
    if (prevDataRef.current && prevDataRef.current !== currentData) {
      setIsDirty(true);
    }
    prevDataRef.current = currentData;
  }, [participants, projectParams, deedDate, portageFormula, isInitialized]);

  // Unsaved changes warning
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

  // Calculations
  const calculations = useMemo(() => {
    if (!participants || !projectParams) {
      return {
        totalSurface: 0,
        pricePerM2: 0,
        sharedCosts: 0,
        sharedPerPerson: 0,
        participantBreakdown: [],
        totals: {
          purchase: 0,
          totalDroitEnregistrements: 0,
          construction: 0,
          shared: 0,
          totalTravauxCommuns: 0,
          travauxCommunsPerUnit: 0,
          total: 0,
          capitalTotal: 0,
          totalLoansNeeded: 0,
          averageLoan: 0,
          averageCapital: 0
        }
      };
    }
    return calculateAll(participants, projectParams, unitDetails, deedDate || undefined, portageFormula || undefined);
  }, [participants, projectParams, deedDate, portageFormula]);

  // === SAVE ===
  const save = useCallback(async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      toast.custom(() => <SimpleToast message="Supabase non configuré" type="error" />);
      return false;
    }

    if (!participants || !projectParams || !deedDate || !portageFormula) {
      toast.custom(() => <SimpleToast message="Données incomplètes" type="error" />);
      return false;
    }

    setIsSaving(true);
    setSyncError(null);

    // Pass original participants for granular updates (only changed participants will be updated in DB)
    const result = await saveProject(
      projectId,
      {
        id: projectId,
        participants,
        projectParams,
        deedDate,
        portageFormula,
      },
      originalDataRef.current?.participants
    );

    setIsSaving(false);

    if (result.success) {
      setIsDirty(false);
      setLastSyncedAt(new Date());
      originalDataRef.current = { participants, projectParams, deedDate, portageFormula };
      toast.custom(() => <SimpleToast message="Sauvegardé!" type="success" />);
      console.log('✅ Saved to Supabase');
      return true;
    } else {
      setSyncError(result.error || 'Save failed');
      toast.custom(() => <SimpleToast message={`Erreur: ${result.error}`} type="error" />);
      console.error('❌ Save failed:', result.error);
      return false;
    }
  }, [participants, projectParams, deedDate, portageFormula, projectId]);

  // === DISCARD ===
  const discard = useCallback(async (): Promise<void> => {
    if (originalDataRef.current) {
      setParticipants(originalDataRef.current.participants);
      setProjectParams(originalDataRef.current.projectParams);
      setDeedDate(originalDataRef.current.deedDate);
      setPortageFormula(originalDataRef.current.portageFormula);
      setIsDirty(false);
      toast.custom(() => <SimpleToast message="Modifications annulées" type="success" />);
    }
  }, [setParticipants, setProjectParams, setDeedDate, setPortageFormula]);

  // Actions
  const addParticipant = useCallback(() => {
    if (!participants || !deedDate) return;
    const newParticipants = participantOps.addParticipant(participants, deedDate);
    setParticipants(newParticipants);

    setTimeout(() => {
      const newIndex = participants.length;
      if (participantRefs.current[newIndex]?.scrollIntoView) {
        participantRefs.current[newIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }, [participants, deedDate, participantOps, setParticipants, participantRefs]);

  const removeParticipant = useCallback((index: number) => {
    if (!participants || participants.length <= 1) return;
    if (participants[index].name === pinnedParticipant) {
      handleUnpinParticipant();
    }
    const newParticipants = participantOps.removeParticipant(participants, index);
    setParticipants(newParticipants);
  }, [participants, pinnedParticipant, handleUnpinParticipant, participantOps, setParticipants]);

  const updateParticipant = useCallback((index: number, updated: Participant) => {
    if (!participants) return;
    const newParticipants = [...participants];
    const oldName = newParticipants[index].name;
    newParticipants[index] = updated;
    setParticipants(newParticipants);

    if (oldName === pinnedParticipant && updated.name !== oldName) {
      handlePinParticipant(updated.name);
    }
  }, [participants, pinnedParticipant, handlePinParticipant, setParticipants]);

  const updateParticipantName = useCallback((index: number, name: string) => {
    if (!participants) return;
    const oldName = participants[index].name;
    const newParticipants = participantOps.updateParticipantName(participants, index, name);
    setParticipants(newParticipants);

    if (oldName === pinnedParticipant) {
      handlePinParticipant(name);
    }
  }, [participants, pinnedParticipant, handlePinParticipant, participantOps, setParticipants]);

  const updateParticipantSurface = useCallback((index: number, surface: number) => {
    if (!participants) return;
    const newParticipants = participantOps.updateParticipantSurface(participants, index, surface);
    setParticipants(newParticipants);
  }, [participants, participantOps, setParticipants]);

  const handleRenovationStartDateChange = useCallback((newRenovationStartDate: string) => {
    if (!projectParams) return;

    if (deedDate && new Date(newRenovationStartDate) < new Date(deedDate)) {
      toast.custom(() => <SimpleToast message="La date de rénovation doit être après l'acte" type="error" />);
      return;
    }

    setProjectParams({
      ...projectParams,
      renovationStartDate: newRenovationStartDate
    });
  }, [projectParams, deedDate, setProjectParams]);

  const handleDeedDateChange = useCallback((newDeedDate: string) => {
    if (!participants || !deedDate) {
      setDeedDate(newDeedDate);
      return;
    }

    try {
      const oldDate = new Date(deedDate);
      const newDate = new Date(newDeedDate);
      const delta = newDate.getTime() - oldDate.getTime();

      const updatedParticipants = participants.map(participant => {
        if (!participant.entryDate) return participant;
        const oldEntryDate = new Date(participant.entryDate);
        const newEntryDate = new Date(oldEntryDate.getTime() + delta);
        return { ...participant, entryDate: newEntryDate };
      });

      let updatedProjectParams = projectParams;
      if (projectParams?.renovationStartDate) {
        const oldRenovationDate = new Date(projectParams.renovationStartDate);
        const newRenovationDate = new Date(oldRenovationDate.getTime() + delta);
        updatedProjectParams = {
          ...projectParams,
          renovationStartDate: newRenovationDate.toISOString().split('T')[0]
        };
      }

      setDeedDate(newDeedDate);
      setParticipants(updatedParticipants);
      if (updatedProjectParams) setProjectParams(updatedProjectParams);
    } catch (error) {
      console.error('Error updating deed date:', error);
      toast.custom(() => <SimpleToast message="Erreur de date" type="error" />);
    }
  }, [participants, deedDate, projectParams, setDeedDate, setParticipants, setProjectParams]);

  const exportToExcel = useCallback(() => {
    if (!participants || !projectParams || !deedDate || !portageFormula) return;
    const writer = new XlsxWriter();

    const timelineSnapshots = generateParticipantSnapshots(
      participants,
      calculations,
      deedDate,
      portageFormula,
      projectParams
    );

    exportCalculations(
      calculations,
      projectParams,
      unitDetails,
      writer,
      undefined,
      { timelineSnapshots, participants }
    );
  }, [participants, projectParams, deedDate, portageFormula, calculations]);

  const downloadScenario = useCallback(() => {
    if (!participants || !projectParams || !deedDate || !portageFormula) return;
    downloadScenarioFile(
      participants,
      projectParams,
      deedDate,
      portageFormula,
      unitDetails,
      calculations
    );
  }, [participants, projectParams, deedDate, portageFormula, calculations]);

  const loadScenario = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useMemo(() => createFileUploadHandler(
    (data) => {
      setParticipants(data.participants);
      setProjectParams(data.projectParams);
      if (data.deedDate) setDeedDate(data.deedDate);
      setPortageFormula(data.portageFormula);
      setIsInitialized(true);
      toast.custom(() => <SimpleToast message="Scénario chargé!" type="success" />);
    },
    (error) => {
      toast.custom(() => <SimpleToast message={error} type="error" />);
    }
  ), [setParticipants, setProjectParams, setDeedDate, setPortageFormula, setIsInitialized]);

  const resetToDefaults = useCallback(() => {
    if (confirm('Réinitialiser toutes les données?')) {
      setParticipants(DEFAULT_PARTICIPANTS);
      setProjectParams(DEFAULT_PROJECT_PARAMS);
      setDeedDate(DEFAULT_DEED_DATE);
      setPortageFormula(DEFAULT_PORTAGE_FORMULA);
      setIsInitialized(true);
    }
  }, [setParticipants, setProjectParams, setDeedDate, setPortageFormula, setIsInitialized]);

  // Context value
  const contextValue: CalculatorContextValue = {
    state: {
      participants: participants || [],
      projectParams: projectParams || DEFAULT_PROJECT_PARAMS,
      deedDate: deedDate || DEFAULT_DEED_DATE,
      portageFormula: portageFormula || DEFAULT_PORTAGE_FORMULA,
      pinnedParticipant,
      fullscreenParticipantIndex,
      versionMismatch,
      syncMode: isSupabaseConfigured() ? 'supabase' : 'localStorage',
      isSyncing: isSaving,
      isDirty,
      lastSyncedAt,
      syncError,
      calculations,
      unitDetails
    },
    actions: {
      addParticipant,
      removeParticipant,
      updateParticipant,
      updateParticipantName,
      updateParticipantSurface,
      setParticipants,
      setProjectParams,
      setDeedDate,
      handleDeedDateChange,
      handleRenovationStartDateChange,
      setPortageFormula,
      setFullscreenParticipantIndex,
      setVersionMismatch,
      handlePinParticipant,
      handleUnpinParticipant,
      downloadScenario,
      loadScenario,
      resetToDefaults,
      exportToExcel,
      save,
      discard
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-lg mb-2">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <div className="text-lg mb-2">❌ Erreur de chargement</div>
          <div className="text-sm text-gray-600 mb-4">{loadError}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </CalculatorContext.Provider>
  );
}
