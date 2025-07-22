export const DEFAULT_PACKAGE = 'SHA-01';
export const TEST_PACKAGES = [
  { id: 'SHA-01', name: 'Ambulance and Emergency Services' },
  { id: 'SHA-03', name: 'Critical Care Services' },
  { id: 'SHA-05', name: 'Optical Health Services' },
  {id: 'SHA-16', name: 'Renal Care Services' },
  { id: 'SHA-07', name: 'Inpatient ' },
];

export const INTERVENTION_CODES = {
  'SHA-01': [
    { code: 'SHA-01-001', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-002', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-003', name: 'Cardiac/Respiratory Arrest' },
    { code: 'SHA-01-004', name: 'Major Trauma' },
    { code: 'SHA-01-005', name: 'Shock states' },
    { code: 'SHA-01-006', name: 'Altered level of consciousness' },
    { code: 'SHA-01-007', name: 'Severe respiratory distress' },
    { code: 'SHA-01-008', name: 'Seizures/Status epilepticus' },
    { code: 'SHA-01-010', name: 'Acute Cerebrovascular Accidents' },
    { code: 'SHA-01-011', name: 'Anti-Rabies' },
    { code: 'SHA-01-012', name: 'Anti-Snake Venom' },
    { code: 'SHA-01-013', name: 'Chest Pain' },
  ],
  'SHA-03': [
    { code: 'SHA-03-001', name: 'ICU Care' },
    { code: 'SHA-03-002', name: 'HDU Care' },
    { code: 'SHA-03-003', name: 'NICU Care' },
    { code: 'SHA-03-004', name: 'PICU Care' },
    { code: 'SHA-03-005', name: 'Intensive care Burns Unit' }
  ],
  'SHA-05': [
    { code: 'SHA-05-001', name: 'Consultation and prescription and issuing of glasses' },
  ],
  'SHA-07': [
    { code: 'SHA-07-001', name: ' Management of medical cases' },
    { code: 'SHA-07-002', name: 'Surgical Complications' },
  ],
  'SHA-16': [
    { code: 'SHA-16-001', name: 'Hemo dialysis' },
    { code: 'SHA-16-002', name: 'Hemodiafiltration' },
  ],
};