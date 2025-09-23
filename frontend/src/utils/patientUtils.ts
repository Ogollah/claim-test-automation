import { getPatientByCrID, postPatient, updatePatient } from "@/lib/api";
import { Patient } from "@/lib/types";
import { HIE_URL } from "@/lib/utils";

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

type AuthTokenParams = {
    email: string;
    password: string;
};

// TODO: Implement token retrieval
export const getAuthenticationToken = async (params: AuthTokenParams) => {
    const url = HIE_URL.AUTH_URL;
    const body = new URLSearchParams({
        grant_type: HIE_URL.PATHS.GRANT_TYPE,
        client_id: HIE_URL.PATHS.CLIENT_ID,
        code: process.env.CLIENT_SECRET || 'secret',
        code_verifier: 'secret',
        email: params.email,
        password: params.password,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        console.error(`Failed to get authentication token: ${response.statusText}`);
    }
    console.log('-->Auth response', response);
    return response.json();
};

export const existingPatients = async () => {
    const url = `${HIE_URL.QUERY_PATIENT_URL}/?endDate=2025-08-18+23:59:59&startDate=2025-01-25+00:00:00&shaCode=SHA-08-005&sortBy=creationDate&direction=desc&page=0&size=20&status=APPROVED`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${await getAuthenticationToken({ email: 'demo@mail.com', password: 'demo' })}`,
        },
    });

    if (!response.ok) {
        console.error(`Failed to fetch existing patients: ${response.statusText}`);
    }
    console.log('-->Existing patients response', response);

    return response;
}