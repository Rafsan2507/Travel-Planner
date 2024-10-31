"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { format } from "date-fns";
import { getTravelsById, updateTravel } from "@/redux/TravelSlice/TravelSlice";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const ItineraryWithMap = () => {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("./MapComponent"), {
        loading: () => <p>Map is loading</p>,
        ssr: false,
      }),
    []
  );
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [newDestination, setNewDestination] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [distances, setDistances] = useState<string[]>([]);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getTravelsById(id));
    }
  }, [dispatch, id]);

  const travel = useSelector((state: RootState) => state.travel.travel);

  const handleAddActivity = () => {
    if (newActivity) {
      setActivities([...activities, newActivity]);
      setNewActivity("");
    }
  };

  const handleAddDestination = () => {
    if (newDestination && activities.length > 0) {
      const updatedTravel = {
        ...travel,
        destinations: [
          ...(travel.destinations || []),
          {
            destination: newDestination,
            activities: activities.map((activity) => ({ activity })),
          },
        ],
      };
      dispatch(updateTravel(updatedTravel));
      setNewDestination("");
      setActivities([]);
    }
  };

  const handlePinLocation = (placeName: string) => {
    setNewDestination(placeName); // Set the new destination from the pinned location
  };

  return (
    <div className="flex gap-4 mx-[20vw]">
      <div className="mt-4">
        <Card className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold">{travel.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{travel.description}</p>

          <div className="flex justify-between mb-4">
            <p>
              <strong>Start Date: </strong>
              {travel.startdate && format(new Date(travel.startdate), "PPP")}
            </p>
            <p>
              <strong>End Date: </strong>
              {travel.enddate && format(new Date(travel.enddate), "PPP")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Existing Destinations:</h3>
            {travel.destinations?.map((dest, index) => (
              <div key={index} className="mt-2">
                <h4 className="font-semibold">{dest.destination}</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {dest.activities.map((activity, actIndex) => (
                    <li key={actIndex}>{activity.activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Label htmlFor="destination" className="mb-2 block">
              New Destination:
            </Label>
            <Input
              id="destination"
              type="text"
              placeholder="Enter destination"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              className="mb-4"
            />

            <Label htmlFor="activity" className="mb-2 block">
              Add Activity for this Destination:
            </Label>
            <Input
              id="activity"
              type="text"
              placeholder="Enter activity"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddActivity} className="bg-[#50b3ea] hover:bg-[#50b3ea] hover:text-cyan-800 font-semibold">
              Add Activity
            </Button>
            {activities.length > 0 && (
              <ul className="mb-4">
                {activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            )}

            <Button onClick={handleAddDestination} className="bg-[#50b3ea] hover:bg-[#50b3ea] hover:text-cyan-800 font-semibold">
              Add Destination
            </Button>
          </div>

          {distances.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Distances:</h3>
              <ul>
                {distances.map((distance, index) => (
                  <li key={index}>{distance}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
      <div className="flex-grow py-4">
        <MapComponent
          destinations={travel.destinations || []}
          onDistanceCalculated={setDistances}
          onPinLocation={handlePinLocation}
        />
      </div>
    </div>
  );
};

export default ItineraryWithMap;
