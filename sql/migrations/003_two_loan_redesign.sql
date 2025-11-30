-- Two-Loan Financing Redesign Migration
-- Version: 003
-- Date: 2025-11-30
--
-- This migration simplifies the two-loan financing model:
-- - Removes capital_for_loan1 column (merged into capital_apporte)
-- - capital_apporte now represents capital available at signature
-- - capital_for_loan2 remains for additional capital available later
--
-- See docs/2025-11-30-two-loan-redesign.md for full design rationale

-- ============================================
-- Step 1: Migrate existing data
-- ============================================
-- For participants with useTwoLoans=true and capital_for_loan1 set,
-- move capital_for_loan1 value to capital_apporte (signature capital)

UPDATE participants
SET capital_apporte = COALESCE(capital_for_loan1, capital_apporte)
WHERE use_two_loans = true
  AND capital_for_loan1 IS NOT NULL;

-- ============================================
-- Step 2: Drop deprecated column
-- ============================================

ALTER TABLE participants DROP COLUMN IF EXISTS capital_for_loan1;

-- ============================================
-- Step 3: Add comment for documentation
-- ============================================

COMMENT ON COLUMN participants.capital_apporte IS 'Capital available at signature (for loan 1 in two-loan mode)';
COMMENT ON COLUMN participants.capital_for_loan2 IS 'Additional capital available later, e.g., from house sale (for loan 2)';
COMMENT ON COLUMN participants.loan2_renovation_amount IS 'Optional override for construction phase costs (defaults to auto-calculated)';
