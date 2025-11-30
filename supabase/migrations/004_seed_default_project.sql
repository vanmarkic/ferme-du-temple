-- Seed default project with scenario data
-- Run this in Supabase SQL Editor
-- Date: 2025-11-30

-- First fix schema: loan2_delay_years should be NUMERIC not INT (can be 1.5 years)
ALTER TABLE participants ALTER COLUMN loan2_delay_years TYPE NUMERIC;

-- Add anon read access policies
CREATE POLICY "Anon users can read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can read participants"
  ON participants FOR SELECT
  TO anon
  USING (true);

-- Update the default project with full params from scenario
UPDATE projects SET
  project_params = '{
    "totalPurchase": 650000,
    "mesuresConservatoires": 0,
    "demolition": 0,
    "infrastructures": 0,
    "etudesPreparatoires": 0,
    "fraisEtudesPreparatoires": 0,
    "fraisGeneraux3ans": 0,
    "batimentFondationConservatoire": 0,
    "batimentFondationComplete": 0,
    "batimentCoproConservatoire": 0,
    "globalCascoPerM2": 1590,
    "cascoTvaRate": 6,
    "maxTotalLots": 11,
    "renovationStartDate": "2027-02-23",
    "travauxCommuns": {
      "enabled": true,
      "items": [{"sqm": 338, "label": "Rénovation complète", "amount": 270000, "cascoPricePerSqm": 600, "parachevementPricePerSqm": 200}]
    },
    "expenseCategories": {
      "habitabiliteSommaire": [
        {"label": "plomberie", "amount": 1000},
        {"label": "électricité (refaire un tableau)", "amount": 1000},
        {"label": "retirer des lignes (électrique)", "amount": 2000},
        {"label": "isolation thermique", "amount": 1000},
        {"label": "cloisons", "amount": 2000},
        {"label": "chauffage", "amount": 0}
      ],
      "conservatoire": [
        {"label": "Traitement Mérule", "amount": 40000},
        {"label": "Démolition (mérule)", "amount": 20000},
        {"label": "nettoyage du site", "amount": 6000},
        {"label": "toitures", "amount": 10000},
        {"label": "sécurité du site? (portes, accès..)", "amount": 2000}
      ],
      "premierTravaux": [
        {"label": "poulailler", "amount": 150},
        {"label": "atelier maintenance (et reparation)", "amount": 500},
        {"label": "stockage ressources/énergie/consommables (eau, bois,...)", "amount": 700},
        {"label": "verger prix par 1ha", "amount": 2000},
        {"label": "atelier construction", "amount": 2500},
        {"label": "Cuisine (commune)", "amount": 3000},
        {"label": "travaux chapelle rudimentaires", "amount": 5000},
        {"label": "local + outil jardin", "amount": 5000}
      ]
    }
  }'::jsonb,
  portage_formula = '{
    "indexationRate": 2,
    "carryingCostRecovery": 100,
    "averageInterestRate": 4.5,
    "coproReservesShare": 0
  }'::jsonb
WHERE id = 'default';

-- Insert participants
INSERT INTO participants (
  project_id, display_order, name, is_founder, entry_date, surface,
  capital_apporte, registration_fees_rate, interest_rate, duration_years,
  unit_id, quantity, parachevements_per_m2, casco_sqm, parachevements_sqm,
  use_two_loans, loan2_delay_years, loan2_renovation_amount,
  capital_for_loan1, capital_for_loan2, lots_owned, purchase_details, enabled
) VALUES
-- Manuela/Dragan
('default', 0, 'Manuela/Dragan', true, '2026-02-01', 150,
 50000, 3, 4, 25,
 1, 1, 500, 140, 120,
 true, 1.5, 200000,
 NULL, 100000, '[]'::jsonb, NULL, true),

-- Cathy/Jim
('default', 1, 'Cathy/Jim', true, '2026-02-01', 225,
 450000, 3, 4.5, 25,
 3, 1, 250, 175, 225,
 true, NULL, 266925,
 150000, 300000, '[]'::jsonb, NULL, true),

-- Annabelle/Colin
('default', 2, 'Annabelle/Colin', true, '2026-02-01', 200,
 200000, 12.5, 4, 25,
 5, 1, 500, 120, 120,
 false, NULL, NULL,
 NULL, NULL,
 '[{"lotId": 1, "unitId": 5, "acquiredDate": "2026-02-01", "isPortage": false, "allocatedSurface": 118, "surface": 118}]'::jsonb,
 NULL, true),

-- Julie/Séverin
('default', 3, 'Julie/Séverin', true, '2026-02-01', 150,
 245000, 3, 4, 25,
 6, 1, 500, NULL, NULL,
 true, NULL, 236023.2,
 70000, 175000, '[]'::jsonb, NULL, true),

-- Participant·e 5 (newcomer)
('default', 4, 'Participant·e 5', false, '2027-02-01', 60,
 50000, 3, 4, 25,
 7, 1, 500, NULL, NULL,
 false, NULL, NULL,
 NULL, NULL, '[]'::jsonb,
 '{"buyingFrom": "Copropriété", "lotId": 999, "purchasePrice": 88399.43, "breakdown": {"feesRecovery": 0, "renovations": 0, "indexation": 1651.26, "carryingCostRecovery": 4128.17, "basePrice": 82620}}'::jsonb,
 true),

-- Participant·e 6 (newcomer)
('default', 5, 'Participant·e 6', false, '2027-02-01', 101,
 100000, 12.5, 4.5, 25,
 8, 1, 500, NULL, NULL,
 false, NULL, NULL,
 NULL, NULL, '[]'::jsonb,
 '{"purchasePrice": 147332.38, "lotId": 999, "buyingFrom": "Copropriété"}'::jsonb,
 true),

-- Participant·e 7 (newcomer)
('default', 6, 'Participant·e 7', false, '2027-02-01', 100,
 100000, 12.5, 4.5, 25,
 9, 1, 500, NULL, NULL,
 false, NULL, NULL,
 NULL, NULL, '[]'::jsonb,
 '{"purchasePrice": 147332.38, "buyingFrom": "Copropriété", "lotId": 999}'::jsonb,
 true),

-- Participant·e 8 (newcomer)
('default', 7, 'Participant·e 8', false, '2027-02-01', 100,
 100000, 12.5, 4.5, 25,
 10, 1, 500, NULL, NULL,
 false, NULL, NULL,
 NULL, NULL, '[]'::jsonb,
 '{"lotId": 999, "buyingFrom": "Copropriété", "purchasePrice": 147332.38}'::jsonb,
 true),

-- Participant·e 9 (newcomer)
('default', 8, 'Participant·e 9', false, '2027-02-01', 100,
 100000, 12.5, 4.5, 25,
 11, 1, 500, NULL, NULL,
 false, NULL, NULL,
 NULL, NULL, '[]'::jsonb,
 '{"purchasePrice": 147332.38, "buyingFrom": "Copropriété", "lotId": 999}'::jsonb,
 true);
