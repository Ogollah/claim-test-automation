// components/InterventionSelector.tsx
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Intervention = {
  code: string
  name: string
}

export default function InterventionSelector({
  packageId,
  interventions,
  selectedIntervention,
  onSelectIntervention,
}: {
  packageId: string
  interventions: Intervention[]
  selectedIntervention: string
  onSelectIntervention: (code: string) => void
}) {
  const selected = interventions.find((i) => i.code === selectedIntervention)

  return (
    <div className="space-y-2">
      <Label htmlFor="intervention">Intervention Code</Label>

      <Select
        onValueChange={onSelectIntervention}
        value={selectedIntervention}
        disabled={!packageId}
      >
        <SelectTrigger id="intervention" className="w-full">
          <SelectValue placeholder="Select an intervention" />
        </SelectTrigger>
        <SelectContent>
          {interventions.map((intervention) => (
            <SelectItem key={intervention.code} value={intervention.code}>
              {intervention.name} ({intervention.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <p className="text-sm text-muted-foreground">
          Selected: {selected.name}
        </p>
      )}
    </div>
  )
}
