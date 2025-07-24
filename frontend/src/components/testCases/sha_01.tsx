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


// SHA-01-004 TEST CASES
export const postiveSha01004 = [
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
        "code": "SHA-01-004",
        "display": "Major Taruma",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "93042",
          "currency": "KES"
        },
        "net": {
          "value": 93042,
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
      "value": 93042,
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
        "code": "SHA-01-004",
        "display": "Cardiac/Respiratory Arrest",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "93042",
          "currency": "KES"
        },
        "net": {
          "value": 93042,
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
      "value": 93042,
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
        "code": "SHA-01-004",
        "display": "Cardiac/Respiratory Arrest",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "56500",
          "currency": "KES"
        },
        "net": {
          "value": 56500,
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
      "value": 56500,
      "currency": "KES"
    }
  }
}
]
export const negativeSha01004 = [
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
        "code": "SHA-01-004",
        "display": "Major Trauma",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "93042",
          "currency": "KES"
        },
        "net": {
          "value": 93042,
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
      "value": 93042,
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
        "code": "SHA-01-004",
        "display": "Major Trauma",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "180200",
          "currency": "KES"
        },
        "net": {
          "value": 180200,
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
      "value": 180200,
      "currency": "KES"
    }
  }
}
]

// SHA-01-005 TEST CASES
export const postiveSha01005 = [
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
        "code": "SHA-01-005",
        "display": "Shock states",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "74898",
          "currency": "KES"
        },
        "net": {
          "value": 74898,
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
      "value": 74898,
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
        "code": "SHA-01-005",
        "display": "Shock states",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "74898",
          "currency": "KES"
        },
        "net": {
          "value": 74898,
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
      "value": 74898,
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
        "code": "SHA-01-005",
        "display": "Shock states",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "26700",
          "currency": "KES"
        },
        "net": {
          "value": 26700,
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
      "value": 26700,
      "currency": "KES"
    }
  }
}
]

export const negativeSha01005 = [
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
        "code": "SHA-01-005",
        "display": "Shock states",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "74898",
          "currency": "KES"
        },
        "net": {
          "value": 74898,
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
      "value": 74898,
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
        "code": "SHA-01-005",
        "display": "Shock states",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "153400",
          "currency": "KES"
        },
        "net": {
          "value": 153400,
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
      "value": 153400,
      "currency": "KES"
    }
  }
}
]

// SHA-01-006 TEST CASES
export const postiveSha01006 = [
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
        "code": "SHA-01-006",
        "display": "Altered level of consciouness",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "20656",
          "currency": "KES"
        },
        "net": {
          "value": 20656,
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
      "value": 20656,
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
        "code": "SHA-01-006",
        "display": "Altered level of consciouness",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "20656",
          "currency": "KES"
        },
        "net": {
          "value": 20656,
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
      "value": 20656,
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
        "code": "SHA-01-006",
        "display": "Altered level of consciouness",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "15670",
          "currency": "KES"
        },
        "net": {
          "value": 15670,
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
      "value": 15670,
      "currency": "KES"
    }
  }
}
]

export const negativeSha01006 = [
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
        "code": "SHA-01-006",
        "display": "Altered level of consciouness",
        "quantity": {
          "value": "1"
        },
        "unitPrice": {
          "value": "20656",
          "currency": "KES"
        },
        "net": {
          "value": 20656,
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
      "value": 20656,
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
        "code": "SHA-01-006",
        "display": "Altered level of consciouness",
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
}
]

export const testCasePackageSHA01 = {
  id: 'SHA-01',
  name: 'Ambulance and Emergency Services',
  SHA01InteventionTestCases: [
    { code: 'SHA-01-003', positive: postiveSha01003, negative: negativeSha01003, },
    { code: 'SHA-01-004', positive: postiveSha01004, negative: negativeSha01004, }
  ]
}

export const testCasesPackages = [
  testCasePackageSHA01,
]