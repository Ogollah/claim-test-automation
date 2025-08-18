export const testCaseSamples = [
  {
    formData: {
      test: 'positive',
      title: 'Test Eligible Facility level (SHA-01-003)',
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
          unitPrice: { value: '102905', currency: 'KES' },
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
  },
  {
    formData: {
      title: "Test Eligible Facility Level (SHA-03-001)",
      test: "positive",
      patient: {
        id: "CR6683935187504-9",
        name: "VERONICAH ATIENO MAENDE",
        gender: "female",
        birthDate: "1999-11-28",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6683935187504-9"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "336000",
            currency: "KES"
          },
          net: {
            value: 336000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T09:54:42.673Z"
      },
      total: {
        value: 336000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Maximum Days Allowable (SHA-03-001)",
      test: "positive",
      patient: {
        id: "CR6683935187504-9",
        name: "VERONICAH ATIENO MAENDE",
        gender: "female",
        birthDate: "1999-11-28",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6683935187504-9"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "336000",
            currency: "KES"
          },
          net: {
            value: 336000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T09:54:42.673Z"
      },
      total: {
        value: 336000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Eligible Access Path (Inpatient) (SHA-03-001)",
      test: "positive",
      patient: {
        id: "CR6683935187504-9",
        name: "VERONICAH ATIENO MAENDE",
        gender: "female",
        birthDate: "1999-11-28",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6683935187504-9"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "336000",
            currency: "KES"
          },
          net: {
            value: 336000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T09:54:42.673Z"
      },
      total: {
        value: 336000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test for Amount less than admission days (SHA-03-001)",
      test: "positive",
      patient: {
        id: "CR6988460984266-1",
        name: "SOPHIE KARARAM RENOI",
        gender: "female",
        birthDate: "1994-08-16",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6988460984266-1"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "295000",
            currency: "KES"
          },
          net: {
            value: 295000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T10:10:25.209Z"
      },
      total: {
        value: 295000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Eligible Facility Level (SHA-03-001)",
      test: "negative",
      patient: {
        id: "CR6988460984266-1",
        name: "SOPHIE KARARAM RENOI",
        gender: "female",
        birthDate: "1994-08-16",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6988460984266-1"
          }
        ]
      },
      provider: {
        id: "FID-45-116336-8",
        name: "BOIGE HEALTH CENTRE",
        level: "LEVEL 3A",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116336-8"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "336000",
            currency: "KES"
          },
          net: {
            value: 336000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T10:10:25.209Z"
      },
      total: {
        value: 336000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Maximum Days Allowable (SHA-03-001)",
      test: "negative",
      patient: {
        id: "CR6988460984266-1",
        name: "SOPHIE KARARAM RENOI",
        gender: "female",
        birthDate: "1994-08-16",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6988460984266-1"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "392000",
            currency: "KES"
          },
          net: {
            value: 392000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-15"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-15",
        created: "2025-08-15T10:10:25.209Z"
      },
      total: {
        value: 392000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Eligible Access Path (Outpatient) (SHA-03-001)",
      test: "negative",
      patient: {
        id: "CR6683935187504-9",
        name: "VERONICAH ATIENO MAENDE",
        gender: "female",
        birthDate: "1999-11-28",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6683935187504-9"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "op",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "336000",
            currency: "KES"
          },
          net: {
            value: 336000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T09:54:42.673Z"
      },
      total: {
        value: 336000,
        currency: "KES"
      }
    }
  },
  {
    formData: {
      title: "Test Amount Greater than Admission Days (SHA-03-001)",
      test: "negative",
      patient: {
        id: "CR6988460984266-1",
        name: "SOPHIE KARARAM RENOI",
        gender: "female",
        birthDate: "1994-08-16",
        identifiers: [
          {
            use: "official",
            system: "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
            value: "CR6988460984266-1"
          }
        ]
      },
      provider: {
        id: "FID-45-116423-4",
        name: "KISII TEACHING AND REFERRAL HOSPITAL",
        level: "LEVEL 5",
        identifiers: [
          {
            system: "FID",
            value: "FID-45-116423-4"
          },
          {
            system: "SladeCode",
            value: "5885"
          }
        ],
        active: true
      },
      use: "claim",
      claimSubType: "ip",
      practitioner: null,
      productOrService: [
        {
          code: "SHA-03-001",
          display: "ICU Care",
          quantity: {
            value: "1"
          },
          unitPrice: {
            value: "400000",
            currency: "KES"
          },
          net: {
            value: 400000,
            currency: "KES"
          },
          servicePeriod: {
            start: "2025-08-01",
            end: "2025-08-13"
          },
          sequence: 1
        }
      ],
      billablePeriod: {
        billableStart: "2025-08-01",
        billableEnd: "2025-08-13",
        created: "2025-08-15T10:10:25.209Z"
      },
      total: {
        value: 400000,
        currency: "KES"
      }
    }
  }
];


export const testCaseSample = 
  {
    formData: {
      test: 'positive',
      title: 'Test Eligible Facility level (SHA-03-001)',
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
          unitPrice: { value: '102905', currency: 'KES' },
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