# Zod and Supabase Integration

## Current Architecture

This package uses **Zod as the primary validation layer** with Supabase types for database operations.

## Schema Organization

### Application Schemas (camelCase)
Used throughout the app for type safety and validation:

```typescript
import { ProjectParamsSchema, ParticipantSchema } from '@repo/credit-calculator/schemas';

// Validate input
const result = ParticipantSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

### Database Schemas (snake_case)
Separate schemas for Supabase row validation:

```typescript
// In src/schemas/project.ts
export const SupabaseProjectRowSchema = z.object({
  id: z.string().uuid(),
  deed_date: z.string(),
  project_params: ProjectParamsSchema,
  // ...
});
```

## Key Features Used

| Feature | Example |
|---------|---------|
| Type coercion | `z.coerce.date()` for date strings |
| Cross-field validation | `.refine()` for entry/exit date rules |
| Default values | `z.boolean().default(true)` |
| Custom error messages | `z.string().min(1, 'Name is required')` |

## Validation Boundaries

Zod validates at:
1. **Form submission** - before saving to DB
2. **Data loading** - when reading from Supabase
3. **JSON import** - scenario file parsing
4. **Cross-entity rules** - lot uniqueness, participant counts

## Guidelines

- Keep app schemas (camelCase) separate from DB schemas (snake_case)
- Use `.safeParse()` for user input, `.parse()` for trusted data
- Add `.refine()` for business rules that span multiple fields
- Export both `Schema` and inferred `Type` for each entity
