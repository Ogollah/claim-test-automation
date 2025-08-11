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
      "id": "FID-45-116423-4",
      "name": "KISII TEACHING AND REFERRAL HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116423-4"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-19-463",
        "display": "Total Hip Replacement",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "336000",
          "currency": "KES"
        },
        "net": {
          "value": 336000,
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
      "value": 336000,
      "currency": "KES"
    }
  }
},
    {
  "formData": {
    "test": "positive",
    "title": "Test exact claimable amount allowable",
    "patient": {
      "id": "CR0667877990791-6",
      "name": "VIRGINIA MUMBUA MUTHOKA",
      "gender": "male",
      "birthDate": "1993-07-01",
      "identifiers": [
        {
          "system": "SHA",
          "value": "CR0667877990791-6"
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
      ],
      "active": true
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-19-464",
        "display": "Total knee replacement (TKR) (Including implants, MUST have a peer review of three doctors)",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "336000",
          "currency": "KES"
        },
        "net": {
          "value": 336000,
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
      "value": 336000,
      "currency": "KES"
    }
  }
},
{
  "formData": {
    "test": "positive",
    "title": "Test amount less than claimable amount allowable",
    "patient": {
      "id": "CR5017841212527-8",
      "name": "BIBIANA BLESSING MWENDE MUTHIANI",
      "gender": "female",
      "birthDate": "2009-23-02",
      "identifiers": [
        {
          "system": "SHA",
          "value": "CR5017841212527-8"
        },
        {
          "system": "NationalID",
          "value": "-"
        }
      ]
    },
     "provider": {
      "id": "FID-45-116336-8",
      "name": "TENWEK HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116336-8"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
    },
    "use": {
      "id": "claim"
    },
    "productOrService": [
      {
        "code": "SHA-19-574",
        "display": "Orchidectomy & excision of spermatic cord",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "448000",
          "currency": "KES"
        },
        "net": {
          "value": 448000,
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
      "id": "FID-43-112246-5",
      "name": "HAWI FAMILY HOSPITAL",
      "level": "LEVEL 3A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-43-112246-5"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
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
      "id": "FID-45-116423-4",
      "name": "KISII TEACHING AND REFERRAL HOSPITAL",
      "level": "LEVEL 5",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-45-116423-4"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
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
      "id": "FID-43-112246-5",
      "name": "HAWI FAMILY HOSPITAL",
      "level": "LEVEL 3A",
      "identifiers": [
        {
          "system": "FID",
          "value": "FID-43-112246-5"
        },
        {
          "system": "SladeCode",
          "value": "5885"
        }
      ],
      "active": true
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
          "value": "102915",
          "currency": "KES"
        },
        "net": {
          "value": 102915,
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
      "value": 102915,
      "currency": "KES"
    }
  }
}
 
]
 