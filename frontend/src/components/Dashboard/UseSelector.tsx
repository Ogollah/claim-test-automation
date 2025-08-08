import { useState } from "react"
import { Label } from "../ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"

type UseOption = {
  id: string
}

export default function UseSelector({
  use,
  onSelectUse,
}: {
  use: UseOption | null
  onSelectUse: (use: UseOption) => void
}) {
  const [uses] = useState<UseOption[]>([
    { id: "claim" },
    { id: "preauthorization" },
  ])

  return (
    <div className="space-y-2">
      <Label htmlFor="use">Select use</Label>

      <Select
        value={use?.id || ""}
        onValueChange={(value) => {
          const selected = uses.find((u) => u.id === value)
          if (selected) onSelectUse(selected)
        }}
      >
        <SelectTrigger id="use" className="w-full">
          <SelectValue placeholder="Select use" />
        </SelectTrigger>
        <SelectContent>
          {uses.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
