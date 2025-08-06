import { FhirPractitionerResource, Practitioner, PractitionerItem } from "./types";



export const practitionerPayload = (data: Practitioner): PractitionerItem => {
  
    return {
        pu_id: data.id,
        name: data.name,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        national_id: data.nationalID,
        email: data.email,
        slade_code: data.sladeCode,
        reg_number: data.regNumber,
        status: data.status ? 1 : 0
    }
}
export const hiePractitioners = (data: FhirPractitionerResource[]): Practitioner[] => {
  return data.map((entry) => {
    const name = entry.name?.[0]?.text ?? "Unknown";
    const address = entry.address?.[0]?.text ?? "Unknown";
    const identifiers = entry.identifier ?? [];
    const telecom = entry.telecom ?? [];

    return {
      id: entry.id,
      name,
      gender: entry.gender,
      address,
      nationalID: identifiers.find(i => i.system?.endsWith("National_ID"))?.value ?? "",
      regNumber: identifiers.find(i => i.system?.endsWith("PractitionerRegistrationNumber"))?.value ?? "",
      sladeCode: identifiers.find(i => i.system?.endsWith("SladeCode"))?.value ?? "",
      email: telecom.find(i => i.system === "email")?.value ?? "",
      phone: telecom.find(i => i.system === "phone")?.value ?? "",
      status: entry.active
    };
  });
};
