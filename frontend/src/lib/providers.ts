import { FhirProviderResource, FormatProvider, Provider, ProviderItem } from "./types";

export const hieProviders =  (data: FhirProviderResource[]): FormatProvider[] => {
  return data.map((entry) => {
    return {
      id: entry.id,
      name: entry.name,
      level: entry.extension[0].valueCodeableConcept.coding[0].display,
      identifiers:[{
        system: 'FID',
        value: entry.id,
      },
      {
        system: 'SladeCode',
        value: '5885'
      }
    ],
      active: entry.active
    };
  });
};

export const providerPayload = (data: Provider): ProviderItem => {
  return {
    f_id: data.id,
    name: data.name,
    level: data.level,
    status: data.active ? 1 : 0,
    slade_code: data.identifiers.find(i => i.system === "SladeCode")?.value,
  }
}

// [
//     {
//         id: 'FID-45-116336-8',
//         name: 'BOIGE HEALTH CENTRE',
//         level: 'LEVEL 3A',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-45-116336-8'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//       {
//         id: 'FID-47-108521-3',
//         name: 'KENYATTA NATIONAL HOSPITAL',
//         level: 'LEVEL 6A',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-47-108521-3'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//       {
//         id: 'FID-45-116336-8',
//         name: 'TENWEK HOSPITAL',
//         level: 'LEVEL 5',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-45-116336-8'
//           },
//           { 
//             system: 'SladeCode',
//             value: '101231' 
//           }
//         ]
//       },
//       {
//         id: 'FID-22-104475-5',
//         name: 'THIKA COUNTY REFERRAL HOSPITAL',
//         level: 'LEVEL 5',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-22-104475-5'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//       {
//         id: 'FID-47-104693-4',
//         name: '5TH AVENUE MEDICAL AND DAY SURGERY CENTRE',
//         level: 'LEVEL 3B',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-47-104693-4'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//       {
//         id: 'FID-22-104568-7',
//         name: 'GATUNDU COUNTY REFERRAL HOSPITAL',
//         level: 'LEVEL 4',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-22-104568-7'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//        {
//         id: 'FID-43-112246-5',
//         name: 'Hawi Family Hospital',
//         level: 'LEVEL 4',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-43-112246-5'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//       {
//         id: 'FID-39-102645-6',
//         name: 'BUNGOMA COUNTY REFERRAL HOSPITAL',
//         level: 'LEVEL 4',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-39-102645-6'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//         {
//         id: 'FID-47-105577-8',
//         name: 'FIGO CARE PLUS (K) LIMITED UPPER HILL',
//         level: 'LEVEL 3A',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-47-105577-8'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       },
//          {
//         id: 'FID-47-108846-4',
//         name: 'NAIROBI WEST HOSPITAL',
//         level: 'LEVEL 6B',
//         identifiers: [
//           { 
//             system: 'FID', 
//             value: 'FID-47-108846-4'
//           },
//           { 
//             system: 'SladeCode',
//             value: '5885' 
//           }
//         ]
//       }
//   ]