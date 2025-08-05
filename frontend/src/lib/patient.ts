import { email } from "zod";
import { FhirPatientResource, FormatPatient, Patient, PatientBundle } from "./types";

export const patients =  (data: Patient[]): FormatPatient[] => {
    return data.map((p) => ({
    id: p.cr_id,
    name: p.name,
    gender: p.gender,
    birthDate: p.birthdate,
    identifiers: [
      {
        system: p.system_value || 'SHA',
        value: p.cr_id,
      },
      {
        system: 'NationalID',
        value: p.national_id || '-',
      },
    ],
  }));
};

export const hiePatients =  (data: FhirPatientResource[]): FormatPatient[] => {
  return data.map((entry) => {
    return {
      id: entry.id,
      name: entry.name?.[0]?.text ?? "Unknown",
      gender: entry.gender,
      birthDate: entry.birthDate,
      identifiers: entry.identifier ?? [],
    };
  });
};

export const patientPayload = (data: FormatPatient): Patient => {
  const shaIdentifier = data.identifiers.find((id) => id.system === "SHA");
  const nationalId = data.identifiers.find((id) => id.system === "NationalID");

  return {
    cr_id: data.id,
    name: data.name,
    gender: data.gender,
    birthdate: data.birthDate,
    system_value: shaIdentifier?.system || "",
    national_id: nationalId?.value || "",
    email: ""
  };
};
// [
//     {
//         id: 'CR0680969605010-6',
//         name: 'WINNIE BOIT JEPKEMOI',
//         gender: 'female',
//         birthDate: '1978-09-07',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR0680969605010-6' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '0682501720'
//           }
//         ]
//       },
//       {
//         id: 'CR6768517341770-3',
//         name: 'RIO BARAKA MUSYOKI',
//         gender: 'male',
//         birthDate: '2022-11-02',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR6768517341770-3' 
//           },
//           { 
//             system: 'NationalID', 
//             value: ''
//           }
//         ]
//       },
//       {
//         id: 'CR9690669737702-4',
//         name: 'MILLICENT OCHOL AKINYI',
//         gender: 'female',
//         birthDate: '1970-10-08',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR9690669737702-4' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR9615822367316-7',
//         name: 'TABITHA JEROP AMDANY',
//         gender: 'female',
//         birthDate: '2012-12-26',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR9615822367316-7' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '9413776'
//           }
//         ]
//       },
//       {
//         id: 'CR1118057253439-6',
//         name: 'LEYLA ABDI MAHAT',
//         gender: 'female',
//         birthDate: '2023-10-21',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR1118057253439-6' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR5953780200478-4',
//         name: 'GAVIN KIPYATOR TUWEI',
//         gender: 'male',
//         birthDate: '2025-19-06',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR5953780200478-4' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR4840792843761-1',
//         name: 'BEATRICE KANYUOKIE WACERA',
//         gender: 'female',
//         birthDate: '1996-31-12',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR4840792843761-1' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR5771662566066-5',
//         name: 'charlton githaiga ngatia',
//         gender: 'male',
//         birthDate: '2013-29-06',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR5771662566066-5' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR9778513470154-4',
//         name: 'JAMES MURIUNGI MURIUKI',
//         gender: 'male',
//         birthDate: '1980-23-01',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR9778513470154-4' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//       {
//         id: 'CR5017841212527-8',
//         name: 'BIBIANA BLESSING MWENDE MUTHIANI',
//         gender: 'male',
//         birthDate: '2009-23-02',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR5017841212527-8' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//        {
//         id: 'CR5662527999993-4',
//         name: 'JULIUS KIPKIRUI',
//         gender: 'male',
//         birthDate: '1963-31-12',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR5662527999993-4' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       },
//         {
//         id: 'CR0667877990791-6',
//         name: 'VIRGINIA MUMBUA MUTHOKA',
//         gender: 'female',
//         birthDate: '1993-07-02',
//         identifiers: [
//           { 
//             system: 'SHA', 
//             value: 'CR0667877990791-6' 
//           },
//           { 
//             system: 'NationalID', 
//             value: '-'
//           }
//         ]
//       }
//   ]