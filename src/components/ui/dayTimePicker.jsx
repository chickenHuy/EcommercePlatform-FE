import * as React from "react"
import { format, startOfYear, endOfYear, eachMonthOfInterval, isAfter } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarDays } from "lucide-react"

export function DatePicker({ date, setDate }) {
    const today = new Date()

    const [selectedDate, setSelectedDate] = React.useState(date)
    const [month, setMonth] = React.useState(selectedDate?.getMonth() || today.getMonth())
    const [year, setYear] = React.useState(selectedDate?.getFullYear() || today.getFullYear())
    const [isOpened, setIsOpened] = React.useState(false)

    const years = React.useMemo(() => {
        return Array.from({ length: today.getFullYear() - 1899 }, (_, i) => today.getFullYear() - i)
    }, [])

    const months = React.useMemo(() => {
        return eachMonthOfInterval({
            start: startOfYear(new Date(year, 0, 1)),
            end: endOfYear(new Date(year, 0, 1))
        })
    }, [year])

    const handleYearChange = (selectedYear) => {
        const newYear = parseInt(selectedYear, 10)
        setYear(newYear)

        let newDate = new Date(selectedDate)
        newDate.setFullYear(newYear)

        if (isAfter(newDate, today)) {
            newDate = today
        }

        setSelectedDate(newDate)
        setDate(newDate)
    }

    const handleMonthChange = (selectedMonth) => {
        const newMonth = parseInt(selectedMonth, 10) - 1
        setMonth(newMonth)

        let newDate = new Date(selectedDate)
        newDate.setMonth(newMonth)

        if (isAfter(newDate, today)) {
            newDate = today
        }

        setSelectedDate(newDate)
        setDate(newDate)
    }

    const handleDateChange = (newDate) => {
        if (newDate && !isAfter(newDate, today)) {
            setSelectedDate(newDate)
            setDate(newDate)
            setIsOpened(false)
        }
    }

    return (
        <Popover open={isOpened} onOpenChange={setIsOpened}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full flex justify-start items-center text-left",
                        !selectedDate && "text-muted-foreground"
                    )}
                >
                    <span className="flex-grow">
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>dd/MM/yyyy</span>}
                    </span>
                    <CalendarDays />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex justify-between p-2 space-x-1">
                    <Select onValueChange={handleYearChange} value={year.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleMonthChange} value={(month + 1).toString()}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((_, index) => (
                                <SelectItem key={index} value={(index + 1).toString()}>
                                    {index + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    month={new Date(year, month)}
                    onMonthChange={(newMonth) => {
                        setMonth(newMonth.getMonth())
                        setYear(newMonth.getFullYear())
                    }}
                    fromYear={1900}
                    toYear={today.getFullYear()}
                    fromDate={new Date(1900, 0, 1)}
                    toDate={today}
                    initialFocus
                    className={"min-w-[270px] min-h-[300px]"}
                />
            </PopoverContent>
        </Popover>
    )
}
