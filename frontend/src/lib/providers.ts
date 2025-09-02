import { getProviderByFID, postProvider, updateProvider } from "./api";
import { FhirProviderResource, FormatProvider, Provider, ProviderItem } from "./types";

export const hieProviders = (data: FhirProviderResource[]): FormatProvider[] => {
  return data.map((entry) => {
    return {
      id: entry.id,
      name: entry.name,
      level: entry.extension[0].valueCodeableConcept.coding[0].display,
      identifiers: [{
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

export const saveHIEProvider = async (providerP: Provider) => {
  try {
    const payload = providerPayload(providerP);
    const provider = await getProviderByFID(payload.f_id);

    if (provider?.data?.f_id) {
      // Update existing provider
      const resp = await updateProvider(Number(provider?.data?.f_id), payload);
      console.log("HIE provider updated successfully:", resp);
      return resp;
    } else {
      // Create new provider
      const resp = await postProvider(payload);
      console.log("HIE provider saved successfully:", resp);
      return resp;
    }
  } catch (error) {
    console.error("Error saving HIE provider:", error);
    throw error;
  }
}

