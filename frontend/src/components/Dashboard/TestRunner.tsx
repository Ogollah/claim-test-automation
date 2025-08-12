import { useEffect, useState } from "react"
import {
  StopIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/16/solid"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"
import { Label } from "../ui/label"
import PatientDetailsPanel from "./PatientDetailsPanel"
import ProviderDetailsPanel from "./ProviderDetailsPanel"
import InterventionSelector from "./InterventionSelector"
import UseSelector from "./UseSelector"
import PractitionerDetailsPanel from "./PractitionerDetailsPanel"
import {
  getInterventionByPackageId,
  getPackages,
} from "@/lib/api"
import {
  Intervention,
  InterventionItem,
  Package,
} from "@/lib/types"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { CalendarIcon, Ghost, Plus } from "lucide-react"
import { format } from "date-fns/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type TestRunnerProps = {
  isRunning?: boolean
  onRunTests?: (testConfig: any) => void
}

export default function TestRunner({
  isRunning = false,
  onRunTests,
}: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedUse, setSelectedUse] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [selectedPractitioner, setSelectedPractitioner] =
    useState<any>(null)
  const [selectedIntervention, setSelectedIntervention] =
    useState<string>("")
const [selectedDates, setSelectedDates] = useState<{
  billableStart: Date | undefined
  billableEnd: Date | undefined
  created: Date
}>({
  billableStart: undefined,
  billableEnd: undefined,
  created: new Date(),
})

  const [packages, setPackages] = useState<Package[]>([])
  const [interventions, setInterventions] = useState<
    InterventionItem[]
  >([])
  const [availableInterventions, setAvailableInterventions] =
    useState<Intervention[]>([])
  const [total, setTotal] = useState<number>(0)

  const [currentIntervention, setCurrentIntervention] = useState({
    serviceQuantity: "",
    unitPrice: "",
    serviceStart: "",
    serviceEnd: "",
  })
  const [open, setOpen] = useState(false)

  const currentNetValue =
    currentIntervention.serviceQuantity &&
    currentIntervention.unitPrice
      ? Number(currentIntervention.serviceQuantity) *
        Number(currentIntervention.unitPrice)
      : 0

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const pck = await getPackages()
        setPackages(pck)
      } catch (error) {
        console.error("--> Error fetching packages:", error)
      }
    }
    fetchPackages()
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      const fetchInterventions = async () => {
        try {
          const intevents = await getInterventionByPackageId(
            selectedPackage
          )
          setAvailableInterventions(intevents || [])
          setSelectedIntervention("")
        } catch (error) {
          console.error("--> Error fetching interventions:", error)
        }
      }
      fetchInterventions()
    } else {
      setAvailableInterventions([])
    }
  }, [selectedPackage]);

  useEffect(() => {
    const newTotal = interventions.reduce(
      (sum, item) => sum + item.netValue,
      0
    )
    setTotal(newTotal)
  }, [interventions])

  const addIntervention = () => {
    if (!selectedPackage || !selectedIntervention) {
      alert("Please select a package and intervention")
      return
    }

    const interventionName =
      availableInterventions.find(
        (i) => i.code === selectedIntervention
      )?.name || ""

    const newIntervention: InterventionItem = {
      id: `${selectedIntervention}-${Date.now()}`,
      packageId: selectedPackage,
      code: selectedIntervention,
      name: interventionName,
      serviceQuantity: currentIntervention.serviceQuantity,
      unitPrice: currentIntervention.unitPrice,
      serviceStart: currentIntervention.serviceStart,
      serviceEnd: currentIntervention.serviceEnd,
      netValue: currentNetValue,
    }

    setInterventions([...interventions, newIntervention])
    setCurrentIntervention({
      serviceQuantity: "",
      unitPrice: "",
      serviceStart: "",
      serviceEnd: "",
    })
  }

  const removeIntervention = (id: string) => {
    setInterventions(
      interventions.filter((item) => item.id !== id)
    )
  }

  const buildTestPayload = () => ({
    formData: {
      title: `Test for ${selectedIntervention}`,
      patient: selectedPatient,
      provider: selectedProvider,
      use: selectedUse,
      practitioner: selectedPractitioner,
      productOrService: interventions.map((intervention, index) => ({
        code: intervention.code,
        display: intervention.name,
        quantity: { value: intervention.serviceQuantity },
        unitPrice: {
          value: intervention.unitPrice,
          currency: "KES",
        },
        net: {
          value: intervention.netValue,
          currency: "KES",
        },
        servicePeriod: {
          start: intervention.serviceStart,
          end: intervention.serviceEnd,
        },
        sequence: index + 1,
      })),
      billablePeriod: selectedDates,
      total: { value: total, currency: "KES" },
    },
  })

  const handleRunTests = () => {
    if (
      !selectedPatient ||
      !selectedProvider ||
      interventions.length === 0
    ) {
      alert(
        "Please select all required fields and add at least one intervention"
      )
      return
    }

    const testConfig = buildTestPayload()
    onRunTests?.(testConfig)
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gay-500">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">
        Claims Test Automation
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-500 mb-4">
          Test Configuration
        </h2>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <UseSelector use={selectedUse} onSelectUse={setSelectedUse} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
          {/* Package Selector (ShadCN Style) */}
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
            <Select
              value={selectedPackage || ""}
              onValueChange={(value) => setSelectedPackage(value)}
            >
              <SelectTrigger id="package" className="w-full">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InterventionSelector
            packageId={selectedPackage}
            interventions={availableInterventions}
            selectedIntervention={selectedIntervention}
            onSelectIntervention={setSelectedIntervention}
          />
        </div>

        {/* Dates help fix this part*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-500">
            {["billableStart", "billableEnd", "created"].map((key) => {
              const label =
                key === "billableStart"
                  ? "Billable Start Date"
                  : key === "billableEnd"
                  ? "Billable End Date"
                  : "Created Date";

              const dateValue = selectedDates[key as keyof typeof selectedDates]
                ? new Date(selectedDates[key as keyof typeof selectedDates] as string)
                : undefined;

              const isCreated = key === "created";

              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                        disabled={isCreated}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={(date) =>
                          setSelectedDates((prev) => ({
                            ...prev,
                            [key]: date ? format(date, "yyyy-MM-dd") : undefined,
                          }))
                        }
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}

        </div>


        {/* Add Intervention */}
        <div className="border-t border-gray-200 pt-4 mb-6 text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              {
                label: "Service quantity",
                value: currentIntervention.serviceQuantity,
                key: "serviceQuantity",
              },
              {
                label: "Unit price",
                value: currentIntervention.unitPrice,
                key: "unitPrice",
              },
              {
                label: "Net value",
                value: currentNetValue,
                key: "netValue",
                disabled: true,
              },
            ].map(({ label, value, key, disabled }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={value}
                  disabled={disabled}
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {["serviceStart", "serviceEnd"].map((key) => {
                const label =
                  key === "serviceStart" ? "Service Start Date" : "Service End Date"

                const dateValue = currentIntervention[key]
                  ? new Date(currentIntervention[key])
                  : undefined

                return (
                  <div key={key} className="flex flex-col gap-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          onSelect={(date) =>
                            setCurrentIntervention((prev) => ({
                              ...prev,
                              [key]: date ? format(date, "yyyy-MM-dd") : "",
                            }))
                          }
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )
              })}

            <div className="flex items-end">
              <Button
                type="button"
                onClick={addIntervention}
                disabled={!selectedPackage || !selectedIntervention}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5"/>
                Add Intervention
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Interventions Table */}
        {interventions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Selected Interventions
            </h3>
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    {["Package",
                      "Intervention",
                      "Quantity",
                      "Unit Price",
                      "Net Value",
                      "Service Period",
                      "Actions",].map((header) =>(
                        <TableHead 
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        scope="col"
                        >
                          {header}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {interventions.map((intervention) => (
                        <TableRow key={intervention.id}>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.packageId}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.code}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.serviceQuantity}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.unitPrice}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.netValue}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.serviceStart} to {" "} {intervention.serviceEnd}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-500">
                            <Button
                              variant="ghost"
                              onClick={()=>
                                removeIntervention(intervention.id)
                              }
                              className="text-red-500 hover:text-red-900"
                            >
                              <TrashIcon className="h-6 w-6" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Patient, Provider, Practitioner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-gray-500">
          <PatientDetailsPanel
            patient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
          <ProviderDetailsPanel
            provider={selectedProvider}
            onSelectProvider={setSelectedProvider}
          />
          <PractitionerDetailsPanel
            practitioner={selectedPractitioner}
            onSelectPractitioner={setSelectedPractitioner}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full">
          <div className="text-gray-500">
            <Label>Total</Label>
            <Input
              type="number"
              className="block w-full px-3 py-2 bg-green-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={total.toFixed(2)}
              disabled
            />
          </div>
          <Button
            type="button"
            onClick={handleRunTests}
            disabled={isRunning || interventions.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isRunning || interventions.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isRunning ? (
              <>
                <StopIcon className="-ml-1 mr-2 h-5 w-5" />
                Running Tests...
              </>
            ) : (
              <>
                <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
