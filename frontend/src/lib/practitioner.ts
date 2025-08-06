import { FhirPractitionerResource, Practitioner } from "./types";



export const practitioners: Practitioner[] = [
    {
        id: 'PUID-0004658-2',
        status: true,
        gender: "female",
        nationalID: "21342123",
        regNumber: "A5079",
        sladeCode: "807460",
        name: "Dr OMAO KEVIN NYAMBAKA",
        phone: "+254722***646",
        email: "n***k@gmail.com",
        address: "P.O BOX 1274 00208 NGONG"

      }
  ];

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
