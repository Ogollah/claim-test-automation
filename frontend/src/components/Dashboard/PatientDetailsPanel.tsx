import { useEffect, useState } from 'react';
import { getPatients, searchPatientHie } from '@/lib/api';
import { FormatPatient } from '@/lib/types';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

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
}: {
  patient: FormatPatient | null;
  onSelectPatient: (patient: FormatPatient) => void;
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
        setPatients(localPatients);
      } catch (error) {
        console.error('Failed to fetch local patients:', error);
      }
    };

    fetchLocalPatients();
  }, []);

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

  const filteredPatients = query
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : patients;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Patient Details</h3>

      <div className="mb-4 space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              {patient
                ? `${patient.name} (${patient.gender}, ${getAge(patient.birthDate)} yrs)`
                : 'Select a patient'}
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
                  if (val.length >= 3) handleSearch(val);
                }}
              />
              <CommandList>
                {loading && (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                )}
                <CommandEmpty>No patients found.</CommandEmpty>
                <CommandGroup>
                  {filteredPatients.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        onSelectPatient(p);
                        setOpen(false);
                        setQuery('');
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
        </div>
      )}
    </div>
  );
}
