import { getPatientByCrID, postPatient, updatePatient } from "@/lib/api";
import { Patient } from "@/lib/types";

export const saveHIEPatient = async (patientPayload: Patient) => {
    try {
        const patient = await getPatientByCrID(patientPayload.cr_id);

        if (patient?.data?.id) {
            // Update existing patient
            const resp = await updatePatient(patient?.data?.id, patientPayload);
            console.log("HIE patient updated successfully:", resp);
            return resp;
        } else {
            // Create new patient
            const resp = await postPatient(patientPayload);
            console.log("HIE patient saved successfully:", resp);
            return resp;
        }
    } catch (error) {
        console.error("Error saving HIE patient:", error);
        throw error;
    }
}