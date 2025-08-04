// import { patients } from '@/lib/patient';
import { getPatients } from '@/lib/api';
import { useEffect, useState } from 'react';
import {FormatPatient } from '@/lib/types'

function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function PatientDetailsPanel({ patient, onSelectPatient }: {
  patient: any;
  onSelectPatient: (patient: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [patients, setPatients] = useState<FormatPatient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const result = await getPatients();
      if (result) {
        setPatients(result);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-800">Patient Details</h3>
        <svg
          className={`h-5 w-5 text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              value={patient?.id || ''}
              onChange={(e) => {
                const selected = patients.find(p => p.id === e.target.value);
                if (selected) onSelectPatient(selected);
              }}
            >
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.gender}, {getAge(p.birthDate)} yrs)
                </option>
              ))}
            </select>
          </div>

          {patient && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-sm text-gray-900">{patient.gender}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="text-sm text-gray-900">{patient.birthDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identifiers</p>
                <ul className="text-sm text-gray-900 space-y-1">
                  {patient.identifiers.map((id: any, index: number) => (
                    <li key={index}>
                      {id.system}: {id.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}