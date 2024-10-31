import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaEdit } from "react-icons/fa";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Travel } from "@/redux/TravelSlice/TravelSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateTravel } from "@/redux/TravelSlice/TravelSlice";

type Props = {
  plan: Partial<Travel>;
};

const UpdateItinerary = ({ plan }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(plan.name || "");
  const [description, setDescription] = useState<string>(
    plan.description || ""
  );
  const [startdate, setStartDate] = React.useState<Date>(
    plan.startdate || new Date()
  );
  const [enddate, setEndDate] = React.useState<Date>(
    plan.enddate || new Date()
  );
  const [destinations, setDestinations] = useState(plan.destinations || []);

  const handleStartDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  const handleEndDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleDestinationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      [field]: value,
    };
    setDestinations(updatedDestinations);
  };

  const handleActivityChange = (
    destIndex: number,
    actIndex: number,
    value: string
  ) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[destIndex].activities[actIndex] = {
      activity: value,
    };
    setDestinations(updatedDestinations);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlan: Partial<Travel> = {
      id: plan.id,
      userId: plan.userId,
      name,
      description,
      startdate,
      enddate,
      destinations,
    };
    dispatch(updateTravel(updatedPlan));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <FaEdit className="cursor-pointer" color="#1ba0e2" size={20}/>
        </div>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Update Itinerary</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                className="col-span-4"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={description}
                className="col-span-4"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !startdate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startdate ? (
                      format(startdate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startdate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !enddate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {enddate ? (
                      format(enddate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={enddate}
                    onSelect={handleEndDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Destination Forms */}
            {destinations.map((destination, destIndex) => (
              <div key={destIndex} className="mt-4">
                <Label>Destination {destIndex + 1}</Label>
                <Input
                  value={destination.destination}
                  onChange={(e) =>
                    handleDestinationChange(
                      destIndex,
                      "destination",
                      e.target.value
                    )
                  }
                  placeholder="Enter destination"
                  className="mb-4"
                />

                {/* Activities for the destination */}
                {destination.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="ml-4">
                    <Label>Activity {actIndex + 1}</Label>
                    <Input
                      value={activity.activity}
                      onChange={(e) =>
                        handleActivityChange(
                          destIndex,
                          actIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter activity"
                      className="mb-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateItinerary;
