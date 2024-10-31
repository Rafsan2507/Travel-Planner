import React from 'react'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import ShowPlans from '../TravelComponent/ShowPlans'

type Props = {}

const FilterByDate = (props: Props) => {
    const [fromdate, setFromDate] = React.useState<Date>();
    const [todate, setToDate] = React.useState<Date>();
  return (
    <div>
    <div className="flex gap-6 mb-6">
    <div>
      <Label htmlFor={`from`} className='pr-2 font-semibold'>From</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !fromdate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromdate ? format(fromdate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={fromdate}
            onSelect={setFromDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
    <div>
      <Label htmlFor={`to`} className='pr-2 font-semibold'>To</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !todate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {todate ? format(todate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={todate}
            onSelect={setToDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
  <ShowPlans fromdate={fromdate} todate={todate} />
  </div>
  )
}

export default FilterByDate