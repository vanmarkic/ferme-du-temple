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
import type { Participant, ProjectParams, PortageFormulaParams } from '@repo/credit-calculator/utils/calculatorUtils';
import type { Lot } from '@repo/credit-calculator/types/timeline';

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
// Save Project Data
// ============================================

export async function saveProject(
  projectId: string,
  data: ProjectData
): Promise<SaveResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getCurrentUser();
  const userId = user?.id;

  try {
    // 1. Upsert project row
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

    // 2. Delete existing participants (we'll replace them all)
    const { error: deleteError } = await supabase
      .from('participants')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) {
      return { success: false, error: 'Failed to clear participants: ' + deleteError.message };
    }

    // 3. Insert all participants
    if (data.participants.length > 0) {
      const participantRows = data.participants.map((p, i) =>
        participantToRow(p, projectId, i, userId)
      );

      const { error: insertError } = await supabase
        .from('participants')
        .insert(participantRows);

      if (insertError) {
        return { success: false, error: 'Failed to save participants: ' + insertError.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving project:', err);
    return { success: false, error: String(err) };
  }
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
