import { getProvide, searchProviderHie } from '@/lib/api';
import { FormatProvider, Provider } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover';
import { Button } from '../ui/button';
import {
  Check,
  ChevronsUpDown,
  Loader2
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { saveHIEProvider } from '@/lib/providers';

type ProviderDetailsPanelProps = {
  provider: Provider | null;
  onSelectProvider: (provider: Provider) => void;
  show?: boolean;
};

export default function ProviderDetailsPanel({
  provider,
  onSelectProvider,
  show = true
}: ProviderDetailsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [providers, setProviders] = useState<FormatProvider[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchLocalProviders = async () => {
      try {
        const localProviders = await getProvide();
        setProviders(localProviders);
      } catch (error) {
        console.error('Failed to fetch local provider: ', error);
      }
    };
    fetchLocalProviders();
  }, []);

  const handleSaveProvider = async (provider: Provider) => {
    try {
      await saveHIEProvider(provider);
      console.log('HIE provider saved successfully');
    } catch (error) {
      console.error('Failed to save provider:', error);
    }
  };

  const handleSearch = async (q: string) => {
    if (!q || q.length < 3) return;
    setLoading(true);
    try {
      const hieProviders = await searchProviderHie('name', q);
      setProviders(prev => {
        const ids = new Set(prev.map(p => p.id));
        const newOnes = hieProviders.filter(p => !ids.has(p.id));
        return [...prev, ...newOnes];
      });
    } catch (err) {
      console.error('HIE search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateProvider = (provider: FormatProvider) => {
    const errors = [];
    if (!provider.id.startsWith('FID')) {
      errors.push('Provider ID must start with FID');
    }
    if (!provider.identifiers.some(id => id.system === 'SladeCode')) {
      errors.push('Missing Slade Code identifier');
    }
    return errors;
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const filteredProviders = query
    ? providers.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    : providers;

  useEffect(() => {
    if (!provider && providers.length > 1) {
      onSelectProvider(providers[1]);
    }
  }, [providers, provider, onSelectProvider]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 w-full">
      <h3 className="text-lg font-medium text-gray-500 mb2">Provider Details</h3>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-gray-500">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap px-3"
              >
                {provider
                  ? `${provider.name} (${provider.level})`
                  : 'Select provider'}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search Provider..."
                  className="h-10"
                  value={query}
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
                  {!loading && filteredProviders.length === 0 && (
                    <CommandEmpty>No provider found</CommandEmpty>
                  )}
                  <CommandGroup>
                    {filteredProviders.map((p) => (
                      <CommandItem
                        key={p.id}
                        onSelect={() => {
                          onSelectProvider(p);
                          handleSaveProvider(p);
                          setOpen(false);
                        }}
                      >
                        {p.name} ({p.level})
                        {provider?.id === p.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {provider && show && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Facility Name
                  </p>
                  <p className="text-sm text-gray-500">{provider.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Level</p>
                  <p className="text-sm text-gray-500">{provider.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-500">
                    {provider.active ? (
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
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-500">
                    {provider.type || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Identifiers</p>
                <ul className="mt-1 space-y-1">
                  {provider.identifiers.map((identifier, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      <span className="font-medium">
                        {identifier.system}:
                      </span>{' '}
                      {identifier.value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Validation
                </h4>
                {validateProvider(provider).length > 0 ? (
                  <ul className="text-sm text-red-600 space-y-1">
                    {validateProvider(provider).map((error, index) => (
                      <li key={index} className="flex items-start">
                        <XCircleIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Provider data is valid
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
