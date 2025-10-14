import { useEffect, useState } from 'react';
import { getPatients, searchPatientHie } from '@/lib/api';
import { FormatPatient, Patient } from '@/lib/types';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { saveHIEPatient } from '@/utils/patientUtils';
import { HIE_URL } from '@/lib/utils';

function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function PatientDetailsPanel({
  patient,
  onSelectPatient,
  show = true,
}: {
  patient: FormatPatient | null;
  onSelectPatient: (patient: FormatPatient) => void;
  show?: boolean
}) {
  const [patients, setPatients] = useState<FormatPatient[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch local patients on mount
  useEffect(() => {
    const fetchLocalPatients = async () => {
      try {
        const localPatients = await getPatients();
        setPatients(localPatients ?? []);
      } catch (error) {
        console.error('Failed to fetch local patients:', error);
      }
    };

    fetchLocalPatients();
  }, []);

  // Save HIE patient on demand
  const handleSave = async (patient: FormatPatient) => {
    const patientPayload: Patient = {
      cr_id: patient.id,
      name: patient.name,
      gender: patient.gender,
      birthdate: patient.birthDate,
      national_id: patient.identifiers?.find(id => id.system.endsWith('nationalid'))?.value || patient.id,
      email: 'mail.mail.com',
      system_value: `${HIE_URL.BASE_URL}/${HIE_URL.PATHS.IDENTIFIER}}`
    };
    try {
      await saveHIEPatient(patientPayload);
      console.log('HIE patient saved successfully');
    } catch (error) {
      console.error('Error saving HIE patient:', error);
    }
  };

  // Search HIE on demand
  const handleSearch = async (q: string) => {
    if (!q || q.length < 3) return;
    setLoading(true);
    try {
      const hiePatients = await searchPatientHie('name', q);
      setPatients((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newOnes = hiePatients.filter((p: FormatPatient) => !ids.has(p.id));
        return [...prev, ...newOnes];
      });
    } catch (err) {
      console.error('HIE search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);


  const filteredPatients = query
    ? patients.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    : patients;

  useEffect(() => {
    if (!patient && patients.length > 1) {
      onSelectPatient(patients[1]);
    }
  }, [patients, patient, onSelectPatient]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-green-900 mb-2">Patient Details</h3>

      <div className="mb-4 space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap px-3"
            >
              <span className="truncate block">
                {patient
                  ? `${patient.name} (${patient.gender}, ${getAge(patient.birthDate)} yrs)`
                  : 'Select a patient'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search patient..."
                className="h-9"
                onValueChange={(val) => {
                  setQuery(val);
                }}
              />
              <CommandList>
                {loading && (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                )}

                {!loading && filteredPatients.length === 0 && (
                  <CommandEmpty>No patients found.</CommandEmpty>
                )}

                <CommandGroup>
                  {filteredPatients.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        onSelectPatient(p);
                        handleSave(p);
                        setOpen(false);
                      }}
                    >
                      {p.name} ({p.gender}, {getAge(p.birthDate)} yrs)
                      {patient?.id === p.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {patient && show && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-500">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-sm text-gray-500">{patient.gender}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            <p className="text-sm text-gray-500">{patient.birthDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}