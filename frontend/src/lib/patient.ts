import { FhirPatientResource, FormatPatient, Patient } from "./types";

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
