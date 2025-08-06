import { Practitioner } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { getPractitioner, searchPractitionerHie } from '@/lib/api';

type PractitionerDetailsPanelProps = {
  practitioner: Practitioner | null;
  onSelectPractitioner: (practitioner: Practitioner) => void;
};

export default function PractitionerDetailsPanel({ practitioner, onSelectPractitioner }: PractitionerDetailsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
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

  const filteredPractitioners = query
  ? practitioners.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  : practitioners;


  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-800">Practitioner Details</h3>
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border'>
                  {practitioner? `${practitioner.name}`:'Select practitioner'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=''>
              <Command>
                <CommandInput
                placeholder='Search practitioner...'
                className='h-9'
                onValueChange={(val) => {
                  setQuery(val);
                  if (val.length >= 3) handleSearch(val);
                }}
                />
                <CommandList>
                  {loading && (
                    <div className='flex items-center justify-center p-2'>
                      <Loader2 className='h-4 w-4 animate-spin text-gray-500' />
                    </div>
                  )}
                  <CommandEmpty>No practitioner found</CommandEmpty>
                  <CommandGroup>
                    {filteredPractitioners.map((p) => (
                      <CommandItem
                        key={p.id}
                        onSelect={() => {
                          onSelectPractitioner(p);
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
                  <p className="text-sm text-gray-900">{practitioner.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-sm text-gray-900">{practitioner.gender}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">
                    {practitioner.status ? (
                      <span className="inline-flex items-center text-green-600">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{practitioner.phone || 'Not specified'}</p>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Validation</h4>
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
      )}
    </div>
  )
}