import { Practitioner } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { getPractitioner, searchPractitionerHie } from '@/lib/api';
import { saveHIEPractitioner } from '@/lib/practitioner';

type PractitionerDetailsPanelProps = {
  practitioner: Practitioner | null;
  onSelectPractitioner: (practitioner: Practitioner) => void;
};

export default function PractitionerDetailsPanel({ practitioner, onSelectPractitioner }: PractitionerDetailsPanelProps) {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchLocalPatients = async () => {
      try {
        const localPractioners = await getPractitioner();
        setPractitioners(localPractioners);
      } catch (error) {
        console.error('Failed to fetch local practitioner:', error);
      }
    };

    fetchLocalPatients();
  }, []);

  const handleSave = async (practitioner: Practitioner) => {
    try {
      await saveHIEPractitioner(practitioner);
      console.log('HIE practitioner saved successfully');
    } catch (error) {
      console.error('Error saving HIE practitioner:', error);
    }
  };


  const validatePractitioner = (practitioner: Practitioner) => {
    const errors = []

    if (!practitioner.id.startsWith('PUID')) {
      errors.push('Practitioner ID must start with PID')
    }

    if (!practitioner.regNumber) {
      errors.push('Missing registration number')
    }

    return errors
  }

  // Search HIE on demand
  const handleSearch = async (q: string) => {
    if (!q || q.length < 3) return;
    setLoading(true);
    try {
      const hiePractitioners = await searchPractitionerHie('gender', q);
      setPractitioners((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newOnes = hiePractitioners.filter((p: Practitioner) => !ids.has(p.id));
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

  const filteredPractitioners = query
    ? practitioners.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    : practitioners;


  return (
    <div className="border border-gray-200 rounded-lg p-4 text-gray-500">
      <h3 className="text-lg font-medium text-gray-500 mb-2">Practitioner Details</h3>
      <div className="mt-4 space-y-4 text-gray-500">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-full justify-between text-pretty md:text-balance'>
              {practitioner ? `${practitioner.name}` : 'Select practitioner'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-full p-0 text-gray-500'>
            <Command>
              <CommandInput
                placeholder='Search practitioner...'
                className='h-10'
                onValueChange={(val) => {
                  setQuery(val);
                }}
              />
              <CommandList>
                {loading && (
                  <div className='flex items-center justify-center p-2'>
                    <Loader2 className='h-4 w-4 animate-spin text-gray-500' />
                  </div>
                )}
                {!loading && filteredPractitioners.length === 0 && (
                  <CommandEmpty>No practitioner found</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredPractitioners.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        onSelectPractitioner(p);
                        handleSave(p);
                        setOpen(false);
                        setQuery('')
                      }}
                    >
                      {p.name}
                      {practitioner?.id === p.id && (
                        <Check className='ml-auto h-4 w-4' />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {practitioner && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-500">{practitioner.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-sm text-gray-500">{practitioner.gender}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-sm text-gray-500">
                  {practitioner.status ? (
                    <span className="inline-flex items-center text-green-500">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-500">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Inactive
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm text-gray-500">{practitioner.phone || 'Not specified'}</p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Validation</h4>
              {validatePractitioner(practitioner).length > 0 ? (
                <ul className="text-sm text-red-600 space-y-1">
                  {validatePractitioner(practitioner).map((error, index) => (
                    <li key={index} className="flex items-start">
                      <XCircleIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      {error}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Practitioner data is valid
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}