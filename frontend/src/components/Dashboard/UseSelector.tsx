import { Label } from "../ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"

type SelectorOption = {
  id: string
  label?: string
}

type SelectorProps = {
  options: SelectorOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export default function CustomSelector({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label = "Select option"
}: SelectorProps) {
  return (
    <div className="space-y-2 text-gray-500">
      <Label>{label}</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label || option.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}