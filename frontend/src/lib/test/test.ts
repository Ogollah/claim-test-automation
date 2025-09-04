export const testCaseSample =
{
  formData: {
    test: 'positive',
    title: 'Sample test do not save me as I will be deleted (edit)',
    patient: {
      id: 'CR9690669737702-4',
      name: 'MILLICENT OCHOL AKINYI',
      gender: 'female',
      birthDate: '1970-10-08',
      identifiers: [
        { system: 'SHA', value: 'CR9690669737702-4' },
        { system: 'NationalID', value: '-' }
      ]
    },
    provider: {
      id: 'FID-22-104475-5',
      name: 'THIKA COUNTY REFERRAL HOSPITAL',
      level: 'LEVEL 5',
      identifiers: [
        { system: 'FID', value: 'FID-22-104475-5' },
        { system: 'SladeCode', value: '5885' }
      ]
    },
    use: 'claim',
    claimSubType: 'ip',
    productOrService: [
      {
        code: 'SHA-01-003',
        display: 'Cardiac/Respiratory Arrest',
        quantity: { value: '1' },
        unitPrice: { value: 102905, currency: 'KES' },
        net: { value: 102905, currency: 'KES' },
        servicePeriod: {
          start: '2025-07-08',
          end: '2025-07-10'
        },
        sequence: 1
      }
    ],
    billablePeriod: {
      billableStart: '2025-07-08',
      billableEnd: '2025-07-10',
      created: '2025-07-18'
    },
    total: {
      value: 102905,
      currency: 'KES'
    }
  }
}