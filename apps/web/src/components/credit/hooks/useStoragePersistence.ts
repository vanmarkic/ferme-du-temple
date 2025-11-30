/**
 * Storage persistence hook
 * Manages auto-save to localStorage
 */

import { useEffect } from 'react';
import {
  saveToLocalStorage,
  type Participant,
  type ProjectParams,
  type PortageFormulaParams,
} from '@repo/credit-calculator/utils';

/**
 * Hook that auto-saves calculator state to localStorage
 */
export function useStoragePersistence(
  participants: Participant[],
  projectParams: ProjectParams,
  deedDate: string,
  portageFormula: PortageFormulaParams,
  versionMismatch: boolean
) {
  useEffect(() => {
    // Don't save if there's a version mismatch (user needs to resolve it first)
    if (!versionMismatch) {
      saveToLocalStorage(participants, projectParams, deedDate, portageFormula);
    }
  }, [participants, projectParams, deedDate, portageFormula, versionMismatch]);
}
