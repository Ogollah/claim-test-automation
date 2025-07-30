// SHA-01-008 TEST CASES
export const postiveSha01008 = [
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "21106",
          "currency": "KES"
        },
        "net": {
          "value": 21106,
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
      "value": 21106,
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "21106",
          "currency": "KES"
        },
        "net": {
          "value": 21106,
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
      "value": 21106,
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "5320",
          "currency": "KES"
        },
        "net": {
          "value": 5320,
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
      "value": 5320,
      "currency": "KES"
    }
  }
}
]

export const negativeSha01008 = [
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
      "id": "FID-43-112246-5",
      "name": "Hawi Family Hospital",
      "level": "LEVEL 4",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-43-112246-5"
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "21106",
          "currency": "KES"
        },
        "net": {
          "value": 21106,
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
      "value": 21106,
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "45500",
          "currency": "KES"
        },
        "net": {
          "value": 45500,
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
      "value": 45500,
      "currency": "KES"
    }
  }
},
    {
  "formData": {
    "test": "negative",
    "title": "Test Private Facility",
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
      "id": "FID-47-106767-4",
      "name": "AAR HOSPITAL LIMITED MUTHAIGA",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-47-106767-4"
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
        "code": "SHA-01-008",
        "display": "Seizures/Status epilepticus",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "21106",
          "currency": "KES"
        },
        "net": {
          "value": 21106,
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
      "value": 21106,
      "currency": "KES"
    }
  }
}
]