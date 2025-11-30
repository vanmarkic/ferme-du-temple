/**
 * Supabase Data Service
 *
 * Simple load/save operations for project data.
 * No real-time sync - just fetch and persist.
 *
 * Data Flow:
 * - Load: DB Row → Transform snake_case → camelCase with defaults → App Types
 * - Save: App Types → Transform camelCase → snake_case → DB
 *
 * Source of Truth: Supabase database (enforces constraints via schema)
 * Validation: DB constraints + simple type transforms (no Zod in data path)
 *
 * Per /docs/zod-and-supabase.md recommendation:
 * - Supabase types + DB constraints are sufficient for this calculator
 * - Add Zod later only for specific pain points (form validation, CSV imports)
 */

import { supabase, isSupabaseConfigured, getCurrentUser } from './supabase';
import type { Participant, ProjectParams, PortageFormulaParams } from '@repo/credit-calculator/utils';
import type { Lot } from '@repo/credit-calculator/types';

// ============================================
// Type Definitions
// ============================================

export interface ProjectData {
  id?: string;
  deedDate: string;
  projectParams: ProjectParams;
  portageFormula: PortageFormulaParams;
  participants: Participant[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface LoadResult {
  success: boolean;
  data?: ProjectData;
  error?: string;
  warnings?: string[];
}

export interface SaveResult {
  success: boolean;
  error?: string;
}

export interface ParticipantChanges {
  added: { index: number; participant: Participant }[];
  removed: Participant[];
  updated: { index: number; participant: Participant }[];
}

export interface ProjectChanges {
  deedDateChanged: boolean;
  projectParamsChanged: boolean;
  portageFormulaChanged: boolean;
  hasChanges: boolean;
}

export interface OriginalProjectData {
  deedDate: string;
  projectParams: ProjectParams;
  portageFormula: PortageFormulaParams;
}

// ============================================
// Change Detection (Pure Function - Testable)
// ============================================

/**
 * Detect changes between original and current participant arrays.
 * Uses unitId as the stable identifier for participants.
 * Returns lists of added, removed, and updated participants.
 */
export function detectParticipantChanges(
  original: Participant[],
  current: Participant[]
): ParticipantChanges {
  const changes: ParticipantChanges = {
    added: [],
    removed: [],
    updated: [],
  };

  // Create maps by unitId for efficient lookup
  const originalByUnitId = new Map(
    original.map((p) => [p.unitId, p])
  );
  const currentByUnitId = new Map(
    current.map((p, index) => [p.unitId, { participant: p, index }])
  );

  // Find removed participants (in original but not in current)
  for (const orig of original) {
    if (!currentByUnitId.has(orig.unitId)) {
      changes.removed.push(orig);
    }
  }

  // Find added and updated participants
  for (const [unitId, { participant, index }] of currentByUnitId) {
    const orig = originalByUnitId.get(unitId);

    if (!orig) {
      // New participant
      changes.added.push({ index, participant });
    } else {
      // Check if changed
      if (!participantsEqual(orig, participant)) {
        changes.updated.push({ index, participant });
      }
    }
  }

  return changes;
}

/**
 * Deep comparison of two participants.
 * Returns true if they are semantically equal.
 */
function participantsEqual(a: Participant, b: Participant): boolean {
  // Compare primitive fields
  if (
    a.name !== b.name ||
    a.capitalApporte !== b.capitalApporte ||
    a.registrationFeesRate !== b.registrationFeesRate ||
    a.interestRate !== b.interestRate ||
    a.durationYears !== b.durationYears ||
    a.surface !== b.surface ||
    a.unitId !== b.unitId ||
    a.quantity !== b.quantity ||
    a.parachevementsPerM2 !== b.parachevementsPerM2 ||
    a.cascoSqm !== b.cascoSqm ||
    a.parachevementsSqm !== b.parachevementsSqm ||
    a.enabled !== b.enabled ||
    a.isFounder !== b.isFounder ||
    a.useTwoLoans !== b.useTwoLoans ||
    a.loan2DelayYears !== b.loan2DelayYears ||
    a.capitalForLoan2 !== b.capitalForLoan2 ||
    a.loan2RenovationAmount !== b.loan2RenovationAmount
  ) {
    return false;
  }

  // Compare dates
  if (!datesEqual(a.entryDate, b.entryDate) || !datesEqual(a.exitDate, b.exitDate)) {
    return false;
  }

  // Compare lotsOwned
  if (!lotsOwnedEqual(a.lotsOwned, b.lotsOwned)) {
    return false;
  }

  // Compare purchaseDetails
  if (!purchaseDetailsEqual(a.purchaseDetails, b.purchaseDetails)) {
    return false;
  }

  return true;
}

function datesEqual(a: Date | undefined, b: Date | undefined): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return a.getTime() === b.getTime();
}

function lotsOwnedEqual(a: Lot[] | undefined, b: Lot[] | undefined): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const lotA = a[i];
    const lotB = b[i];
    if (
      lotA.lotId !== lotB.lotId ||
      lotA.surface !== lotB.surface ||
      lotA.unitId !== lotB.unitId ||
      lotA.isPortage !== lotB.isPortage ||
      lotA.allocatedSurface !== lotB.allocatedSurface ||
      lotA.originalPrice !== lotB.originalPrice ||
      lotA.originalNotaryFees !== lotB.originalNotaryFees ||
      lotA.originalConstructionCost !== lotB.originalConstructionCost ||
      lotA.monthlyCarryingCost !== lotB.monthlyCarryingCost ||
      lotA.founderPaysCasco !== lotB.founderPaysCasco ||
      lotA.founderPaysParachèvement !== lotB.founderPaysParachèvement ||
      lotA.soldTo !== lotB.soldTo ||
      lotA.salePrice !== lotB.salePrice ||
      lotA.carryingCosts !== lotB.carryingCosts ||
      !datesEqual(lotA.acquiredDate, lotB.acquiredDate) ||
      !datesEqual(lotA.soldDate, lotB.soldDate)
    ) {
      return false;
    }
  }
  return true;
}

function purchaseDetailsEqual(
  a: Participant['purchaseDetails'],
  b: Participant['purchaseDetails']
): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return (
    a.buyingFrom === b.buyingFrom &&
    a.lotId === b.lotId &&
    a.purchasePrice === b.purchasePrice &&
    JSON.stringify(a.breakdown) === JSON.stringify(b.breakdown)
  );
}

/**
 * Detect changes between original and current project data.
 * Returns which sections have changed (deedDate, projectParams, portageFormula).
 */
export function detectProjectChanges(
  original: OriginalProjectData,
  current: OriginalProjectData
): ProjectChanges {
  const deedDateChanged = original.deedDate !== current.deedDate;
  const projectParamsChanged = !projectParamsEqual(original.projectParams, current.projectParams);
  const portageFormulaChanged = !portageFormulaEqual(original.portageFormula, current.portageFormula);

  return {
    deedDateChanged,
    projectParamsChanged,
    portageFormulaChanged,
    hasChanges: deedDateChanged || projectParamsChanged || portageFormulaChanged,
  };
}

function projectParamsEqual(a: ProjectParams, b: ProjectParams): boolean {
  return (
    a.totalPurchase === b.totalPurchase &&
    a.mesuresConservatoires === b.mesuresConservatoires &&
    a.demolition === b.demolition &&
    a.infrastructures === b.infrastructures &&
    a.etudesPreparatoires === b.etudesPreparatoires &&
    a.fraisEtudesPreparatoires === b.fraisEtudesPreparatoires &&
    a.fraisGeneraux3ans === b.fraisGeneraux3ans &&
    a.batimentFondationConservatoire === b.batimentFondationConservatoire &&
    a.batimentFondationComplete === b.batimentFondationComplete &&
    a.batimentCoproConservatoire === b.batimentCoproConservatoire &&
    a.globalCascoPerM2 === b.globalCascoPerM2 &&
    a.cascoTvaRate === b.cascoTvaRate &&
    a.maxTotalLots === b.maxTotalLots &&
    a.renovationStartDate === b.renovationStartDate &&
    JSON.stringify(a.expenseCategories) === JSON.stringify(b.expenseCategories) &&
    JSON.stringify(a.travauxCommuns) === JSON.stringify(b.travauxCommuns)
  );
}

function portageFormulaEqual(a: PortageFormulaParams, b: PortageFormulaParams): boolean {
  return (
    a.indexationRate === b.indexationRate &&
    a.carryingCostRecovery === b.carryingCostRecovery &&
    a.averageInterestRate === b.averageInterestRate &&
    a.coproReservesShare === b.coproReservesShare
  );
}

// ============================================
// Transform Functions (DB Row → App Type)
// ============================================

/**
 * Transform a Supabase participant row to app Participant type.
 * Applies sensible defaults for any null/missing values.
 */
function transformParticipantRow(row: Record<string, unknown>): Participant {
  // Transform lots with required fields
  const lotsOwned: Lot[] | undefined = row.lots_owned
    ? (row.lots_owned as Record<string, unknown>[]).map((lot): Lot => ({
        lotId: (lot.lotId as number) ?? (lot.lot_id as number) ?? 1,
        surface: (lot.surface as number) ?? 0,
        unitId: (lot.unitId as number) ?? (lot.unit_id as number) ?? 0,
        isPortage: (lot.isPortage as boolean) ?? (lot.is_portage as boolean) ?? false,
        acquiredDate: lot.acquiredDate ? new Date(lot.acquiredDate as string) :
                      lot.acquired_date ? new Date(lot.acquired_date as string) : new Date(),
        // Optional fields
        originalPrice: lot.originalPrice as number | undefined ?? lot.original_price as number | undefined,
        originalNotaryFees: lot.originalNotaryFees as number | undefined ?? lot.original_notary_fees as number | undefined,
        originalConstructionCost: lot.originalConstructionCost as number | undefined ?? lot.original_construction_cost as number | undefined,
        monthlyCarryingCost: lot.monthlyCarryingCost as number | undefined ?? lot.monthly_carrying_cost as number | undefined,
        allocatedSurface: lot.allocatedSurface as number | undefined ?? lot.allocated_surface as number | undefined,
        founderPaysCasco: lot.founderPaysCasco as boolean | undefined ?? lot.founder_pays_casco as boolean | undefined,
        founderPaysParachèvement: lot.founderPaysParachèvement as boolean | undefined ?? lot.founder_pays_parachevement as boolean | undefined,
        soldDate: lot.soldDate ? new Date(lot.soldDate as string) :
                  lot.sold_date ? new Date(lot.sold_date as string) : undefined,
        soldTo: lot.soldTo as string | undefined ?? lot.sold_to as string | undefined,
        salePrice: lot.salePrice as number | undefined ?? lot.sale_price as number | undefined,
        carryingCosts: lot.carryingCosts as number | undefined ?? lot.carrying_costs as number | undefined,
      }))
    : undefined;

  // Transform purchase details
  const purchaseDetailsRaw = row.purchase_details as Record<string, unknown> | null;
  const purchaseDetails = purchaseDetailsRaw ? {
    buyingFrom: purchaseDetailsRaw.buyingFrom as string ?? purchaseDetailsRaw.buying_from as string ?? '',
    lotId: purchaseDetailsRaw.lotId as number ?? purchaseDetailsRaw.lot_id as number ?? 0,
    purchasePrice: purchaseDetailsRaw.purchasePrice as number ?? purchaseDetailsRaw.purchase_price as number ?? 0,
    breakdown: purchaseDetailsRaw.breakdown as Participant['purchaseDetails'] extends { breakdown?: infer B } ? B : undefined,
  } : undefined;

  return {
    // Required fields with defaults
    name: (row.name as string) || 'Participant',
    capitalApporte: (row.capital_apporte as number) ?? 0,
    registrationFeesRate: (row.registration_fees_rate as number) ?? 12.5,
    interestRate: (row.interest_rate as number) ?? 4.5,
    durationYears: (row.duration_years as number) ?? 25,

    // Boolean/optional fields
    enabled: (row.enabled as boolean) ?? true,
    isFounder: (row.is_founder as boolean) ?? false,

    // Date fields
    entryDate: row.entry_date ? new Date(row.entry_date as string) : undefined,
    exitDate: row.exit_date ? new Date(row.exit_date as string) : undefined,

    // Numeric optional fields
    surface: row.surface as number | undefined,
    unitId: row.unit_id as number | undefined,
    quantity: row.quantity as number | undefined,
    parachevementsPerM2: row.parachevements_per_m2 as number | undefined,
    cascoSqm: row.casco_sqm as number | undefined,
    parachevementsSqm: row.parachevements_sqm as number | undefined,

    // Two-loan fields
    useTwoLoans: (row.use_two_loans as boolean) ?? false,
    loan2DelayYears: row.loan2_delay_years as number | undefined,
    capitalForLoan2: row.capital_for_loan2 as number | undefined,
    loan2RenovationAmount: row.loan2_renovation_amount as number | undefined,

    // Complex nested fields
    lotsOwned,
    purchaseDetails,
  };
}

// ============================================
// Transform Functions (App Type → DB Row)
// ============================================

function participantToRow(p: Participant, projectId: string, order: number, userId?: string) {
  return {
    project_id: projectId,
    display_order: order,
    name: p.name,
    enabled: p.enabled ?? true,
    is_founder: p.isFounder ?? false,
    entry_date: p.entryDate ? p.entryDate.toISOString().split('T')[0] : null,
    exit_date: p.exitDate ? p.exitDate.toISOString().split('T')[0] : null,
    surface: p.surface ?? 0,
    capital_apporte: p.capitalApporte,
    registration_fees_rate: p.registrationFeesRate,
    interest_rate: p.interestRate,
    duration_years: p.durationYears,
    lots_owned: p.lotsOwned ?? [],
    purchase_details: p.purchaseDetails ?? null,
    unit_id: p.unitId ?? null,
    quantity: p.quantity ?? 1,
    parachevements_per_m2: p.parachevementsPerM2 ?? null,
    casco_sqm: p.cascoSqm ?? null,
    parachevements_sqm: p.parachevementsSqm ?? null,
    use_two_loans: p.useTwoLoans ?? false,
    loan2_delay_years: p.loan2DelayYears ?? null,
    capital_for_loan2: p.capitalForLoan2 ?? null,
    loan2_renovation_amount: p.loan2RenovationAmount ?? null,
    updated_by: userId ?? null,
  };
}

// ============================================
// Load Project Data
// ============================================

export async function loadProject(projectId: string): Promise<LoadResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Fetch project with participants in one query
    const { data: projectRow, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        participants (*)
      `)
      .eq('id', projectId)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return { success: false, error: 'Project not found' };
      }
      return { success: false, error: projectError.message };
    }

    if (!projectRow) {
      return { success: false, error: 'No data returned' };
    }

    // Transform participants
    const sortedRows = (projectRow.participants || []).sort(
      (a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
    );

    const participants: Participant[] = sortedRows.map(
      (row: Record<string, unknown>) => transformParticipantRow(row)
    );

    // Build ProjectData object with defaults for missing fields
    const projectParams = projectRow.project_params as ProjectParams;
    const portageFormula = projectRow.portage_formula as PortageFormulaParams;

    const projectData: ProjectData = {
      id: projectRow.id,
      deedDate: projectRow.deed_date,
      projectParams: {
        totalPurchase: projectParams.totalPurchase ?? 500000,
        mesuresConservatoires: projectParams.mesuresConservatoires ?? 0,
        demolition: projectParams.demolition ?? 0,
        infrastructures: projectParams.infrastructures ?? 0,
        etudesPreparatoires: projectParams.etudesPreparatoires ?? 0,
        fraisEtudesPreparatoires: projectParams.fraisEtudesPreparatoires ?? 0,
        fraisGeneraux3ans: projectParams.fraisGeneraux3ans ?? 0,
        batimentFondationConservatoire: projectParams.batimentFondationConservatoire ?? 0,
        batimentFondationComplete: projectParams.batimentFondationComplete ?? 0,
        batimentCoproConservatoire: projectParams.batimentCoproConservatoire ?? 0,
        globalCascoPerM2: projectParams.globalCascoPerM2 ?? 800,
        // Optional fields
        cascoTvaRate: projectParams.cascoTvaRate,
        expenseCategories: projectParams.expenseCategories,
        travauxCommuns: projectParams.travauxCommuns,
        maxTotalLots: projectParams.maxTotalLots,
        renovationStartDate: projectParams.renovationStartDate,
      },
      portageFormula: {
        indexationRate: portageFormula.indexationRate ?? 2.0,
        carryingCostRecovery: portageFormula.carryingCostRecovery ?? 100,
        averageInterestRate: portageFormula.averageInterestRate ?? 4.5,
        coproReservesShare: portageFormula.coproReservesShare ?? 30,
      },
      participants,
      updatedAt: projectRow.updated_at,
      updatedBy: projectRow.updated_by,
    };

    return { success: true, data: projectData };
  } catch (err) {
    console.error('Error loading project:', err);
    return { success: false, error: String(err) };
  }
}

// ============================================
// Save Project Data (split into two functions)
// ============================================

/**
 * Save project-level data (deedDate, projectParams, portageFormula).
 *
 * When originalData is provided, only changed fields are updated.
 * When originalData is not provided, all fields are upserted.
 */
export async function saveProjectData(
  projectId: string,
  data: {
    deedDate: string;
    projectParams: ProjectParams;
    portageFormula: PortageFormulaParams;
  },
  originalData?: OriginalProjectData
): Promise<SaveResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getCurrentUser();
  const userId = user?.id;

  try {
    if (originalData) {
      const projectChanges = detectProjectChanges(originalData, data);

      if (projectChanges.hasChanges) {
        const updateFields: Record<string, unknown> = {
          updated_by: userId,
        };

        if (projectChanges.deedDateChanged) {
          updateFields.deed_date = data.deedDate;
        }
        if (projectChanges.projectParamsChanged) {
          updateFields.project_params = data.projectParams;
        }
        if (projectChanges.portageFormulaChanged) {
          updateFields.portage_formula = data.portageFormula;
        }

        const { error: projectError } = await supabase
          .from('projects')
          .update(updateFields)
          .eq('id', projectId);

        if (projectError) {
          return { success: false, error: 'Failed to save project: ' + projectError.message };
        }

        console.log(`✅ Granular project save: deedDate=${projectChanges.deedDateChanged}, projectParams=${projectChanges.projectParamsChanged}, portageFormula=${projectChanges.portageFormulaChanged}`);
      } else {
        console.log('✅ No project-level changes detected, skipping project update');
      }
    } else {
      const { error: projectError } = await supabase
        .from('projects')
        .upsert({
          id: projectId,
          deed_date: data.deedDate,
          project_params: data.projectParams,
          portage_formula: data.portageFormula,
          updated_by: userId,
        });

      if (projectError) {
        return { success: false, error: 'Failed to save project: ' + projectError.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving project data:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Save participant data with granular updates.
 *
 * When originalParticipants is provided, only changed participants are updated
 * (INSERT for new, UPDATE for changed, DELETE for removed).
 * When originalParticipants is not provided, all participants are deleted and re-inserted.
 */
export async function saveParticipantData(
  projectId: string,
  participants: Participant[],
  originalParticipants?: Participant[]
): Promise<SaveResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getCurrentUser();
  const userId = user?.id;

  try {
    if (originalParticipants) {
      const changes = detectParticipantChanges(originalParticipants, participants);

      // Delete removed participants
      if (changes.removed.length > 0) {
        const removedUnitIds = changes.removed
          .map(p => p.unitId)
          .filter((id): id is number => id !== undefined);

        if (removedUnitIds.length > 0) {
          const { error: deleteError } = await supabase
            .from('participants')
            .delete()
            .eq('project_id', projectId)
            .in('unit_id', removedUnitIds);

          if (deleteError) {
            return { success: false, error: 'Failed to remove participants: ' + deleteError.message };
          }
        }
      }

      // Insert new participants
      if (changes.added.length > 0) {
        const addedRows = changes.added.map(({ index, participant }) =>
          participantToRow(participant, projectId, index, userId)
        );

        const { error: insertError } = await supabase
          .from('participants')
          .insert(addedRows);

        if (insertError) {
          return { success: false, error: 'Failed to add participants: ' + insertError.message };
        }
      }

      // Update changed participants
      if (changes.updated.length > 0) {
        for (const { index, participant } of changes.updated) {
          const row = participantToRow(participant, projectId, index, userId);

          const { error: updateError } = await supabase
            .from('participants')
            .update(row)
            .eq('project_id', projectId)
            .eq('unit_id', participant.unitId);

          if (updateError) {
            return { success: false, error: 'Failed to update participant: ' + updateError.message };
          }
        }
      }

      console.log(`✅ Granular participant save: ${changes.added.length} added, ${changes.updated.length} updated, ${changes.removed.length} removed`);
    } else {
      // Legacy behavior: delete all and re-insert
      const { error: deleteError } = await supabase
        .from('participants')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) {
        return { success: false, error: 'Failed to clear participants: ' + deleteError.message };
      }

      if (participants.length > 0) {
        const participantRows = participants.map((p, i) =>
          participantToRow(p, projectId, i, userId)
        );

        const { error: insertError } = await supabase
          .from('participants')
          .insert(participantRows);

        if (insertError) {
          return { success: false, error: 'Failed to save participants: ' + insertError.message };
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving participant data:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Save all project data (convenience function that calls both saveProjectData and saveParticipantData).
 * @deprecated Use saveProjectData and saveParticipantData separately for better granularity.
 */
export async function saveProject(
  projectId: string,
  data: ProjectData,
  originalData?: {
    participants?: Participant[];
    deedDate?: string;
    projectParams?: ProjectParams;
    portageFormula?: PortageFormulaParams;
  }
): Promise<SaveResult> {
  // Save project data
  const originalProjectData = originalData?.deedDate && originalData?.projectParams && originalData?.portageFormula
    ? { deedDate: originalData.deedDate, projectParams: originalData.projectParams, portageFormula: originalData.portageFormula }
    : undefined;

  const projectResult = await saveProjectData(
    projectId,
    { deedDate: data.deedDate, projectParams: data.projectParams, portageFormula: data.portageFormula },
    originalProjectData
  );

  if (!projectResult.success) {
    return projectResult;
  }

  // Save participant data
  const participantResult = await saveParticipantData(
    projectId,
    data.participants,
    originalData?.participants
  );

  return participantResult;
}

// ============================================
// Create New Project
// ============================================

export async function createProject(
  deedDate: string,
  projectParams: ProjectParams,
  portageFormula?: PortageFormulaParams
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      deed_date: deedDate,
      project_params: projectParams,
      portage_formula: portageFormula ?? {
        indexationRate: 2.0,
        carryingCostRecovery: 100,
        averageInterestRate: 4.5,
        coproReservesShare: 30,
      },
      updated_by: user?.id,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, projectId: data.id };
}

// ============================================
// Delete Project
// ============================================

export async function deleteProject(projectId: string): Promise<SaveResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
