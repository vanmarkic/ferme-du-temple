// Re-export with namespaces to avoid conflicts
export * as utils from './utils';
export * as types from './types';
export * as schemas from './schemas';
export * as stateMachine from './stateMachine';

// Export most commonly used items directly for convenience
export { calculateAll, type CalculationResults } from './utils/calculatorUtils';
export { ProjectParamsSchema, type ProjectParams } from './schemas/project';
export { ParticipantSchema, type Participant } from './schemas/participant';
