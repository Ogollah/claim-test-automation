import { getPractitionerByPuID, getProviderByFID, postPractitioner, postProvider, updatePractitioner, updateProvider } from "./api";
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

export const saveHIEPractitioner = async (practitioner: Practitioner) => {
  try {
    const payload = practitionerPayload(practitioner);
    const provider = await getPractitionerByPuID(payload.pu_id);

    if (provider?.data?.pu_id) {
      // Update existing practitioner
      const resp = await updatePractitioner(provider?.data?.pu_id, payload);
      console.log("HIE practitioner updated successfully:", resp);
      return resp;
    } else {
      // Create new practitioner
      const resp = await postPractitioner(payload);
      console.log("HIE practitioner saved successfully:", resp);
      return resp;
    }
  } catch (error) {
    console.error("Error saving HIE practitioner:", error);
    throw error;
  }
}
