-- Migration: Add newsletter_only column and deduplicate inscriptions
-- Date: 2025-12-03

-- ============================================
-- Step 1: Add newsletter_only column
-- ============================================

ALTER TABLE inscriptions
ADD COLUMN IF NOT EXISTS newsletter_only BOOLEAN DEFAULT false;

-- ============================================
-- Step 2: Mark existing NEWSLETTER rows
-- ============================================

UPDATE inscriptions
SET newsletter_only = true
WHERE nom = 'NEWSLETTER' AND prenom = 'NEWSLETTER';

-- ============================================
-- Step 3: Deduplicate - delete newsletter-only rows
-- where a full candidature exists for same email
-- ============================================

DELETE FROM inscriptions
WHERE id IN (
  SELECT newsletter_row.id
  FROM inscriptions newsletter_row
  INNER JOIN inscriptions full_row
    ON LOWER(newsletter_row.email) = LOWER(full_row.email)
  WHERE newsletter_row.newsletter_only = true
    AND full_row.newsletter_only = false
);

-- ============================================
-- Step 4: Clean up NEWSLETTER placeholder values
-- for remaining newsletter-only rows (optional cleanup)
-- ============================================

-- Keep nom/prenom as NEWSLETTER for clarity, or set to null:
-- UPDATE inscriptions
-- SET nom = NULL, prenom = NULL
-- WHERE newsletter_only = true;

-- ============================================
-- Step 5: Add unique constraint on email
-- ============================================

ALTER TABLE inscriptions
ADD CONSTRAINT inscriptions_email_unique UNIQUE (email);

-- ============================================
-- Step 6: Create index for email lookups
-- ============================================

CREATE INDEX IF NOT EXISTS idx_inscriptions_email
ON inscriptions (LOWER(email));
