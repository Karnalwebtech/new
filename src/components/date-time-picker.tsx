"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    use24HourFormat?: boolean
}

export function DateTimePicker({
    date,
    setDate,
    use24HourFormat: initialUse24HourFormat = false,
}: DateTimePickerProps) {
    const [use24HourFormat, setUse24HourFormat] = React.useState(initialUse24HourFormat)
    const [period, setPeriod] = React.useState<"AM" | "PM">(date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM")

    // For 12-hour format, we need to convert hours
    const getHour12 = (hour24: number) => {
        return hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    }

    // Convert 12-hour format to 24-hour
    const getHour24 = (hour12: number, period: "AM" | "PM") => {
        if (period === "AM") {
            return hour12 === 12 ? 0 : hour12
        } else {
            return hour12 === 12 ? 12 : hour12 + 12
        }
    }

    // Store hour and minute in local state without triggering parent updates
    const [selectedHour, setSelectedHour] = React.useState<string>(
        date ? (use24HourFormat ? format(date, "HH") : getHour12(date.getHours()).toString().padStart(2, "0")) : "12",
    )

    const [selectedMinute, setSelectedMinute] = React.useState<string>(date ? format(date, "mm") : "00")

    // Update local time state when date prop changes
    React.useEffect(() => {
        if (date) {
            if (use24HourFormat) {
                setSelectedHour(format(date, "HH"))
            } else {
                setSelectedHour(getHour12(date.getHours()).toString().padStart(2, "0"))
            }
            setSelectedMinute(format(date, "mm"))
            setPeriod(date.getHours() >= 12 ? "PM" : "AM")
        }
    }, [date, use24HourFormat])

    // Update hour format when switching between 12/24 hour format
    React.useEffect(() => {
        if (date) {
            if (use24HourFormat) {
                setSelectedHour(format(date, "HH"))
            } else {
                setSelectedHour(getHour12(date.getHours()).toString().padStart(2, "0"))
            }
        }
    }, [use24HourFormat, date])

    // Handle time change without causing infinite loops
    const handleTimeChange = (hour: string, minute: string, newPeriod?: "AM" | "PM") => {
        if (!date) return

        const newDate = new Date(date)
        const hourNum = Number.parseInt(hour, 10)

        if (use24HourFormat) {
            newDate.setHours(hourNum)
        } else {
            const periodToUse = newPeriod || period
            newDate.setHours(getHour24(hourNum, periodToUse))
        }

        newDate.setMinutes(Number.parseInt(minute, 10))

        // Only update if the time actually changed
        if (newDate.getHours() !== date.getHours() || newDate.getMinutes() !== date.getMinutes()) {
            setDate(newDate)
        }
    }

    // Generate hours based on format
    const hours = React.useMemo(() => {
        if (use24HourFormat) {
            return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
        } else {
            return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
        }
    }, [use24HourFormat])

    // Generate minutes (00-59)
    const minutes = React.useMemo(() => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")), [])

    return (
        <div className={`grid gap-2`}>
            <div className="flex w-full items-center justify-between mb-2">
                <Label htmlFor="format-toggle" className="text-sm">
                    24-hour format
                </Label>
                <Switch id="format-toggle" checked={use24HourFormat} onCheckedChange={setUse24HourFormat} />
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal" ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            if (newDate) {
                                const updatedDate = new Date(newDate)
                                // Preserve the current time when changing date
                                if (date) {
                                    updatedDate.setHours(date.getHours())
                                    updatedDate.setMinutes(date.getMinutes())
                                } else {
                                    if (use24HourFormat) {
                                        updatedDate.setHours(Number.parseInt(selectedHour, 10))
                                    } else {
                                        updatedDate.setHours(getHour24(Number.parseInt(selectedHour, 10), period))
                                    }
                                    updatedDate.setMinutes(Number.parseInt(selectedMinute, 10))
                                }
                                setDate(updatedDate)
                            } else {
                                setDate(undefined)
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
                <Button id="time" variant={"outline"} className="w-full justify-start text-[10px] p-2 text-left" disabled={!date}>
                    <span> <Clock size={8} className="w-[20px] h-[20px]" /></span>
                    {date
                        ? use24HourFormat
                            ? format(date, "HH:mm")
                            : `${format(date, "hh:mm")} ${date.getHours() >= 12 ? "PM" : "AM"}`
                        : "HH:MM"}
                </Button>

                <div className="flex gap-1">
                    <Select
                        value={selectedHour}
                        onValueChange={(hour) => {
                            setSelectedHour(hour)
                            handleTimeChange(hour, selectedMinute)
                        }}
                        disabled={!date}
                    >
                        <SelectTrigger className="text-[12px]">
                            <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent className="h-[200px] text-[12px]">
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour} className="text-[12px]">
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedMinute}
                        onValueChange={(minute) => {
                            setSelectedMinute(minute)
                            handleTimeChange(selectedHour, minute)
                        }}
                        disabled={!date}
                    >
                        <SelectTrigger className="text-[12px]">
                            <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent className="h-[200px] text-[12px]">
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute} className="text-[12px]">
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {!use24HourFormat && (
                        <Select
                            value={period}
                            onValueChange={(newPeriod: "AM" | "PM") => {
                                setPeriod(newPeriod)
                                handleTimeChange(selectedHour, selectedMinute, newPeriod)
                            }}
                            disabled={!date}
                        >
                            <SelectTrigger className="text-[12px]">
                                <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent className="text-[12px]">
                                <SelectItem value="AM" className="text-[12px]">AM</SelectItem>
                                <SelectItem value="PM" className="text-[12px]">PM</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        </div>
    )
}
