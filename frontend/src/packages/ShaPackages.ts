export const DEFAULT_PACKAGE = 'SHA-01';
export const TEST_PACKAGES = [
  { id: 'SHA-01', name: 'Ambulance and Emergency Services' },
  { id: 'SHA-03', name: 'Critical Care Services' },
  { id: 'SHA-05', name: 'Optical Health Services' },
  {id: 'SHA-06', name: 'Hematology and Oncology Services'},
  { id: 'SHA-07', name: 'Inpatient ' },
  {id: 'SHA-08', name: 'Maternity and Child Health Services'},
  {id: 'SHA-09', name:'Medical Imaging & Other Investigations'},
  {id: 'SHA-10', name: 'Mental Wellness Services'},
  {id: 'SHA-12', name: 'Outpatient Services'},
  {id: 'SHA-13', name: 'Inpatient Services'},
  {id: 'SHA-16', name: 'Renal Care Services' },
  {id: 'SHA-18', name: 'Essential Diagnostic Laboratory listing for NCDs'},
  {id: 'SHA-19', name: 'Surgical Services'},
  {id: 'SHA-20', name: 'Overseas treatment'}
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
    { code: 'SHA-07-005', name: 'Post-partum Complications' },
    { code: 'SHA-07-006', name: 'Neonatal Complications' },
  ],
  'SHA-16': [
    { code: 'SHA-16-001', name: 'Hemo dialysis' },
    { code: 'SHA-16-002', name: 'Hemodiafiltration' },
    { code: 'SHA-16-003', name: 'Permanent dialysis catheter' },
    { code: 'SHA-16-004', name: 'Peritoneal dialysis' },
    { code: 'SHA-16-005', name: 'Insertion of Continuous Ambulatory Peritoneal Dialysis (CAPD) catheter'},
    { code: 'SHA-16-006', name: 'Vascular access placement (catheters, AV fistula, AV graft)'},
    { code: 'SHA-16-007', name: 'Dialysis for acute kidney injury'},
    { code: 'SHA-16-008', name: 'Pre-transplant recipient evaluation'},
    { code: 'SHA-16-009', name: 'Renal Transplant (recipient)'},
    { code: 'SHA-16-010', name: 'Simple Nephrectomy'},
    { code: 'SHA-16-011', name: 'Post renal replacement therapy'}
  ],
  'SHA-12':[
    {code: 'SHA-12-001', name:'Consultation'},
    {code: 'SHA-12-002', name:'Laboratory investigations'}
  ],
  'SHA-08':[
    {code: 'SHA-08-004', name:'Anti-D'},
    {code: 'SHA-08-005', name:'Vaginal Delivery'},
    {code: 'SHA-08-006', name:'Ceaserean section'}
  ],
  'SHA-06':[
    {code: 'SHA-06-001', name:'Histology Small Specimen'},
    {code: 'SHA-06-002', name:'Histology Medium Specimen'},
    {code: 'SHA-06-003', name:'Histology Large Specimen'},
    {code: 'SHA-06-004', name:'Immunoperoxidase studies (Immunohistochemistry) per marker'},
    {code: 'SHA-06-005', name:'Cytology (Gynae Cytology Vaginal or cervical smears, each)'},
    {code: 'SHA-06-006', name:'Cytology Sputum, all body fluids and tumour aspirates: First unit'},
    {code: 'SHA-06-007', name:'Cytology (performance of FNA procedure)'},
    {code: 'SHA-06-008', name:'Flow cytometry (for diagnosis of leukaemia patients) per marker'},
    {code: 'SHA-06-009', name:'Bone marrow aspiration cytological examination'},
    {code: 'SHA-06-010', name:'Bone marrow trephine biopsy'},
    {code: 'SHA-06-011', name:'Bone marrow aspiration procedure'},
    {code: 'SHA-06-012', name:'Bone marrow trephine procedure'},
    {code: 'SHA-06-013', name:'PCR analysis (for gene detection for cancer per marker profile)'},
    {code: 'SHA-06-014', name:'Tumour markers (immunoassay / individual antibody test e.g. CA125, CA19-9, CA15-3, PSA, etc)'},
    {code: 'SHA-06-015', name:'CT Scan for treatment planning'},
    {code: 'SHA-06-016', name:'MRI'},
    {code: 'SHA-06-017', name:'PET SCAN'},
    {code: 'SHA-06-018', name:'PSMA PET SCAN'},
    {code: 'SHA-06-019', name:'Radionucleide scan'},
    {code: 'SHA-06-020', name:'Bone scan'},
    {code: 'SHA-06-021', name:'Chemotherapy administration'},
    {code: 'SHA-06-022', name:'Chemotherapy medicines'},
    {code: 'SHA-06-023', name:'Brachytherapy'},
    {code: 'SHA-06-024', name:'SBRT/SBRS'},
    {code: 'SHA-06-025', name:'Radiotherapy'},
    {code: 'SHA-06-026', name:'Red cell exchange'},
    {code: 'SHA-06-027', name:'Apharetic platelet transfusion'},
    {code: 'SHA-06-028', name:'Chemo port insertion'},
    {code: 'SHA-06-029', name:'Full Blood Count'},
    {code: 'SHA-06-030', name:'Urea/Electrolytes/Creatinine'},
    {code: 'SHA-06-031', name:'Liver Function Tests'},
  ],
  'SHA-10': [
    { code: 'SHA-10-001', name: 'Behavioural Disorders' },
    { code: 'SHA-10-002', name: 'Neuro Development Disorders' },
    { code: 'SHA-10-003', name: 'Affective Disorders' },
    { code: 'SHA-10-004', name: 'Psychoactive Disorders' },
    { code: 'SHA-10-005', name: 'Rehabilitation for Drug & Substance Abuse' },
  ],
  'SHA-13':[
    {code: 'SHA-13-001', name:'Palliative Care'}
  ],
  'SHA-':[
    {code: 'SHA-13-001', name:'Palliative Care'}
  ],
};