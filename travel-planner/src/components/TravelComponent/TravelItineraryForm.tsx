import { User } from "@/redux/AuthSlice/SignUp";
import { addTravel, Travel } from "@/redux/TravelSlice/TravelSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { CgRemoveR } from "react-icons/cg";
import { AppDispatch } from "@/redux/store";
type Props = {
  itineraryId: number;
  handleDeleteItineraryForm:() => void;
}
function TravelItineraryForm({ itineraryId , handleDeleteItineraryForm}: Props) {
  const [itinerary, setItinerary] = useState({
    name: "",
    description: "",
    startdate: "",
    enddate: "",
    destinations: [] as {
      destination: string;
      activities: { activity: string }[];
    }[],
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItinerary({
      ...itinerary,
      [e.target.name]: e.target.value,
    });
  };
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setItinerary({
        ...itinerary,
        startdate: format(date, 'yyyy-MM-dd'),  // Format the date without altering timezones
      });
    }
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setItinerary({
        ...itinerary,
        enddate: format(date, 'yyyy-MM-dd'),  // Same formatting for the end date
      });
    }
  };

  const handleAddDestination = () => {
    setItinerary((prevItinerary) => ({
      ...prevItinerary,
      destinations: [
        ...prevItinerary.destinations,
        { destination: "", activities: [{ activity: "" }] },
      ],
    }));
  };

  const handleDestinationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDestinations = itinerary.destinations.map((dest, i) =>
      i === index ? { ...dest, destination: e.target.value } : dest
    );
    setItinerary({ ...itinerary, destinations: updatedDestinations });
  };

  const handleAddActivity = (destIndex: number) => {
    const updatedDestinations = itinerary.destinations.map((dest, i) =>
      i === destIndex
        ? {
            ...dest,
            activities: [...dest.activities, { activity: "" }],
          }
        : dest
    );
    setItinerary({ ...itinerary, destinations: updatedDestinations });
  };

  const handleActivityChange = (
    destIndex: number,
    activityIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDestinations = itinerary.destinations.map((dest, i) =>
      i === destIndex
        ? {
            ...dest,
            activities: dest.activities.map((act, j) =>
              j === activityIndex ? { ...act, activity: e.target.value } : act
            ),
          }
        : dest
    );
    setItinerary({ ...itinerary, destinations: updatedDestinations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.id) {
      const trav: Partial<Travel> = {
        userId: currentUser.id,
        name: itinerary.name,
        description: itinerary.description,
        startdate: new Date(itinerary.startdate),
        enddate: new Date(itinerary.enddate),
        destinations: itinerary.destinations.map((dest) => ({
          destination: dest.destination,
          activities: dest.activities.map((act) => ({
            activity: act.activity,
          })),
        })),
      };
      await dispatch(addTravel(trav) as any);
      setItinerary({
        name: "",
        description: "",
        startdate: "",
        enddate: "",
        destinations: [],
      });
    }
  };

  
  return (
    <div className="p-4 border rounded-lg mx-8">
      <div className="flex justify-between ">
      <h2 className="text-xl font-semibold mb-4">
        Itinerary {itineraryId + 1}
      </h2>
      <div>
      <CgRemoveR color="red" size={"30px"} className="cursor-pointer" onClick={handleDeleteItineraryForm}/>
      </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor={`name-${itineraryId}`}>Trip Name</Label>
          <Input
            id={`name-${itineraryId}`}
            name="name"
            value={itinerary.name}
            onChange={handleChange}
            placeholder="Enter trip name"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor={`description-${itineraryId}`}>Description</Label>
          <Input
            id={`description-${itineraryId}`}
            name="description"
            value={itinerary.description}
            onChange={handleChange}
            placeholder="Enter short description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor={`startdate-${itineraryId}`}>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !Date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {itinerary.startdate ? format(new Date(itinerary.startdate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={itinerary.startdate ? new Date(itinerary.startdate) : undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor={`enddate-${itineraryId}`}>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !Date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {itinerary.enddate ? format(new Date(itinerary.enddate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={itinerary.enddate ? new Date(itinerary.enddate) : undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mb-4">
          <Label>Destinations & Activities</Label>v
          {itinerary.destinations.map((destination, destIndex) => (
            <div key={destIndex} className="mb-4">
              <Label htmlFor={`destination-${destIndex}`}>
                Destination {destIndex + 1}
              </Label>
              <Input
                id={`destination-${destIndex}`}
                value={destination.destination}
                onChange={(e) => handleDestinationChange(destIndex, e)}
                placeholder="Enter destination"
              />

              <div className="ml-4 mt-2">
                <Label>Activities</Label>
                {destination.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center gap-2 mb-2">
                    <Input
                      value={activity.activity}
                      onChange={(e) =>
                        handleActivityChange(destIndex, actIndex, e)
                      }
                      placeholder="Add activity"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleAddActivity(destIndex)}
                >
                  Add Activity
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={handleAddDestination}>
            Add Destination
          </Button>
        </div>

        <Button type="submit">Save Itinerary</Button>
      </form>
    </div>
  );
}
export default TravelItineraryForm;
