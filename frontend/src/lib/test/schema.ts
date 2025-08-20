export const testCaseSchema = {
  type: 'object',
  properties: {
    formData: {
      type: 'object',
      properties: {
        test: { type: 'string' },
        title: { type: 'string' },
        patient: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            gender: { type: 'string' },
            birthDate: { type: 'string' },
            identifiers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  system: { type: 'string' },
                  value: { type: 'string' }
                },
                required: ['system', 'value']
              }
            }
          },
          required: ['id', 'name', 'gender', 'birthDate', 'identifiers']
        },
        provider: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            level: { type: 'string' },
            identifiers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  system: { type: 'string' },
                  value: { type: 'string' }
                },
                required: ['system', 'value']
              }
            }
          },
          required: ['id', 'name', 'level', 'identifiers']
        },
        use: {type: 'string'},
        claimSubType:{type: 'string'},
        productOrService: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              display: { type: 'string' },
              quantity: {
                type: 'object',
                properties: {
                  value: { type: 'string' }
                },
                required: ['value']
              },
              unitPrice: {
                type: 'object',
                properties: {
                  value: { type: 'number' },
                  currency: { type: 'string' }
                },
                required: ['value', 'currency']
              },
              net: {
                type: 'object',
                properties: {
                  value: { type: 'number' },
                  currency: { type: 'string' }
                },
                required: ['value', 'currency']
              },
              servicePeriod: {
                type: 'object',
                properties: {
                  start: { type: 'string'},
                  end: { type: 'string'}
                },
                required: ['start', 'end']
              },
              sequence: { type: 'number' }
            },
            required: [
              'code',
              'display',
              'quantity',
              'unitPrice',
              'net',
              'servicePeriod',
              'sequence'
            ]
          }
        },
        billablePeriod: {
          type: 'object',
          properties: {
            billableStart: { type: 'string' },
            billableEnd: { type: 'string'},
            created: { type: 'string'}
          },
          required: ['billableStart', 'billableEnd', 'created']
        },
        total: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            currency: { type: 'string' }
          },
          required: ['value', 'currency']
        }
      },
      required: [
        'test',
        'title',
        'patient',
        'provider',
        'use',
        'productOrService',
        'billablePeriod',
        'total'
      ]
    }
  },
  required: ['formData']
};
