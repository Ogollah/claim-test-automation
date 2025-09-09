import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";

interface DateFieldRendererProps {
    label: string;
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export function DateFieldRenderer({
    label,
    date,
    onDateChange,
    disabled = false
}: DateFieldRendererProps) {
    return (
        <div className="flex flex-col gap-3">
            <Label>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0 z-50">
                    <Calendar
                        className="text-blue-500"
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}