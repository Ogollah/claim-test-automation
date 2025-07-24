export const postiveSha01003 = [
    {
  "formData": {
    "test": "positive",
    "title": "Test Eligible Facility level",
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
      "id": "FID-22-104475-5",
      "name": "THIKA COUNTY REFERRAL HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-22-104475-5"
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
          "value": "102905",
          "currency": "KES"
        },
        "net": {
          "value": 102905,
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
      "value": 102905,
      "currency": "KES"
    }
  }
},
    {
  "formData": {
    "test": "positive",
    "title": "Test exact claimable amount allowable",
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
      "id": "FID-22-104475-5",
      "name": "THIKA COUNTY REFERRAL HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-22-104475-5"
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
          "value": "102905",
          "currency": "KES"
        },
        "net": {
          "value": 102905,
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
      "value": 102905,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "positive",
    "title": "Test amount less than claimable amount allowable",
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
      "id": "FID-22-104475-5",
      "name": "THIKA COUNTY REFERRAL HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-22-104475-5"
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
          "value": "95000",
          "currency": "KES"
        },
        "net": {
          "value": 95000,
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
      "value": 95000,
      "currency": "KES"
    }
  }
}
]




export const negativeSha01003 = [
    {
  "formData": {
    "test": "negative",
    "title": "Test Facility level not supported",
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
      "id": "FID-22-104568-7",
      "name": "GATUNDU COUNTY REFERRAL HOSPITAL",
      "level": "LEVEL 4",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-22-104568-7"
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
          "value": "102905",
          "currency": "KES"
        },
        "net": {
          "value": 102905,
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
      "value": 102905,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "negative",
    "title": "Test amount greater than allowable claimable amount",
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
          "value": "150000",
          "currency": "KES"
        },
        "net": {
          "value": 150000,
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
      "value": 150000,
      "currency": "KES"
    }
  }
}
]
