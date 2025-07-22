export const postiveSha01003 = [
    {
  "formData": {
    "test": "positive",
    "title": "Facility level",
    "patient": {
      "id": "CR9690669737702-4",
      "name": "MILLICENT OCHOL AKINYI",
      "gender": "female",
      "birthDate": "1970-10-08",
      "identifiers": [
        {
          "system": "SHA",
          "value": "CR9690669737702-4"
        },
        {
          "system": "NationalID",
          "value": "-"
        }
      ]
    },
    "provider": {
      "id": "FID-45-116336-8",
      "name": "BOIGE HEALTH CENTRE",
      "level": "LEVEL 3A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116336-8"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ]
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-01-003",
        "display": "Cardiac/Respiratory Arrest",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "200",
          "currency": "KES"
        },
        "net": {
          "value": 200,
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
      "billableStart": "2025-07-05",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 3200,
      "currency": "KES"
    }
  }
},
    {
  "formData": {
    "test": "positive",
    "title": "Test Ammont allowable",
    "patient": {
      "id": "CR9690669737702-4",
      "name": "MILLICENT OCHOL AKINYI",
      "gender": "female",
      "birthDate": "1970-10-08",
      "identifiers": [
        {
          "system": "SHA",
          "value": "CR9690669737702-4"
        },
        {
          "system": "NationalID",
          "value": "-"
        }
      ]
    },
    "provider": {
      "id": "FID-45-116336-8",
      "name": "BOIGE HEALTH CENTRE",
      "level": "LEVEL 3A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116336-8"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ]
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-01-003",
        "display": "Cardiac/Respiratory Arrest",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "200",
          "currency": "KES"
        },
        "net": {
          "value": 200,
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
      "billableStart": "2025-07-05",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 3200,
      "currency": "KES"
    }
  }
}
]



export const negativeSha01003 = [
    {
  "formData": {
    "test": "negative",
    "title": "Facility level not supported",
    "patient": {
      "id": "CR9690669737702-4",
      "name": "MILLICENT OCHOL AKINYI",
      "gender": "female",
      "birthDate": "1970-10-08",
      "identifiers": [
        {
          "system": "SHA",
          "value": "CR9690669737702-4"
        },
        {
          "system": "NationalID",
          "value": "-"
        }
      ]
    },
    "provider": {
      "id": "FID-45-116336-8",
      "name": "BOIGE HEALTH CENTRE",
      "level": "LEVEL 3A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116336-8"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ]
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-01-003",
        "display": "Cardiac/Respiratory Arrest",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "200",
          "currency": "KES"
        },
        "net": {
          "value": 200,
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
      "billableStart": "2025-07-05",
      "billableEnd": "2025-07-10",
      "created": "2025-07-18"
    },
    "total": {
      "value": 200,
      "currency": "KES"
    }
  }
}
]

export const testCasePackageSHA01 = {
  id: 'SHA-01',
  name: 'Ambulance and Emergency Services',
  SHA01InteventionTestCases: [
    { code: 'SHA-01-003', positive: postiveSha01003, negative: negativeSha01003, }
  ]
}

export const testCasesPackages = [
  testCasePackageSHA01,
]