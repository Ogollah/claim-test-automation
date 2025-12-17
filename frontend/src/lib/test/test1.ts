export const testCaseSamples = [
{
  "formData": {
    "test": "Positive",
    "title": "Test Exact Billable Amount (SHA-13-001)",
    "patient": {
      "id": "CR7837653726243-4",
      "name": "ROY MWENDA MOKI",
      "gender": "male",
      "birthDate": "1986-12-08",
      "identifiers": [
        {
          "use": "official",
          "system": "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR7837653726243-4"
        }
      ]
    },
    "provider": {
      "id": "FID-47-108846-4",
      "name": "NAIROBI WEST HOSPITAL",
      "level": "LEVEL 6B",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-47-108846-4"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "ip",
    "productOrService": [
      {
        "code": "SHA-13-001",
        "display": "Palliative Care",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": 2240,
          "currency": "KES"
        },
        "net": {
          "value": 2240,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-07-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-07-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 2240,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "Negative",
    "title": "Test Eligible Facility level (SHA-13-001)",
    "patient": {
      "id": "CR2946332632384-9",
      "name": "BENARD WANJOHI NJOROGE",
      "gender": "male",
      "birthDate": "1985-01-18",
      "identifiers": [
        {
          "use": "official",
          "system": " https://qa-sha.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR2946332632384-9"
        }
      ]
    },
    "provider": {
      "id": "FID-20-103850-2",
      "name": "NGUGUINI DISPENSARY",
      "level": "LEVEL 2",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-20-103850-2"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "ip",
    "productOrService": [
      {
        "code": "SHA-13-001",
        "display": "Palliative Care",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": 2240,
          "currency": "KES"
        },
        "net": {
          "value": 2240,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-07-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-07-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 2240,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "Negative",
    "title": "Test Higher Amount(SHA-13-001)",
    "patient": {
      "id": "CR3332641356191-6",
      "name": "JOYCE MBONE KULIVARUA",
      "gender": "female",
      "birthDate": "1987-06-06",
      "identifiers": [
        {
          "use": "official",
          "system": " https://qa-sha.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR3332641356191-6"
        }
      ]
    },
    "provider": {
      "id": "FID-20-105762-7",
      "name": "KIRINYAGA TREATMENT CENTRE",
      "level": "LEVEL 4",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-20-105762-7"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "ip",
    "productOrService": [
      {
        "code": "SHA-13-001",
        "display": "Palliative Care",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": 6600,
          "currency": "KES"
        },
        "net": {
          "value": 6600,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-07-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-07-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 6600,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "Negative",
    "title": "Test more than 180 days(SHA-13-001)",
    "patient": {
      "id": "CR7635833934807-6",
      "name": "BENARD OMBUOGHR OTIENO",
      "gender": "male",
      "birthDate": "1992-07-27",
      "identifiers": [
        {
          "use": "official",
          "system": "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR7635833934807-6"
        }
      ]
    },
    "provider": {
      "id": "FID-47-108521-3",
      "name": "KENYATTA NATIONAL HOSPITAL",
      "level": "LEVEL 6A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-47-108521-3"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "ip",
    "productOrService": [
      {
        "code": "SHA-13-001",
        "display": "Palliative Care",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": 450000,
          "currency": "KES"
        },
        "net": {
          "value": 450000,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-01-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-01-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 450000,
      "currency": "KES"
    }
  }
}, 
{
  "formData": {
    "test": "Negative",
    "title": "Test Access Point(OP)(SHA-13-001)",
    "patient": {
      "id": "CR8486698969488-8",
      "name": "GLADYS MBEKE KIOKO",
      "gender": "female",
      "birthDate": "976-09-22",
      "identifiers": [
        {
          "use": "official",
          "system": "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR8486698969488-8"
        }
      ]
    },
    "provider": {
      "id": "FID-47-108521-3",
      "name": "KENYATTA NATIONAL HOSPITAL",
      "level": "LEVEL 6A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-47-108521-3"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "op",
    "productOrService": [
      {
        "code": "SHA-13-001",
        "display": "Palliative Care",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": 4480,
          "currency": "KES"
        },
        "net": {
          "value": 4480,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-01-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-01-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 4480,
      "currency": "KES"
    }
  }
}, 

// SHA-07-001
{
  "formData": {
    "test": "Positive",
    "title": "Test Exact Amount(SHA-07-001)",
    "patient": {
      "id": "CR8486698969488-8",
      "name": "GLADYS MBEKE KIOKO",
      "gender": "female",
      "birthDate": "1976-09-22",
      "identifiers": [
        {
          "use": "official",
          "system": "https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber",
          "value": "CR8486698969488-8"
        }
      ]
    },
    "provider": {
      "id": "FID-47-108521-3",
      "name": "KENYATTA NATIONAL HOSPITAL",
      "level": "LEVEL 6A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-47-108521-3"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": "claim",
    "claimSubType": "ip",
    "productOrService": [
      {
        "code": "SHA-07-001",
        "display": "Management of medical cases",
        "quantity": {
          "value": "190"
        },
        "unitPrice": {
          "value": 2240,
          "currency": "KES"
        },
        "net": {
          "value": 425600,
          "currency": "KES"
        },
        "servicePeriod": {
          "start": "2025-07-08",
          "end": "2025-07-10"
        },
        "sequence": 1
      }
    ],
    "billablePeriod": {
      "billableStart": "2025-01-08",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 425600,
      "currency": "KES"
    }
  }
},
]