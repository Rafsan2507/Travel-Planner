"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../ui/card";
import { format, isWithinInterval, isAfter, isBefore } from "date-fns";
import { AppDispatch, RootState } from "@/redux/store";
import { User } from "@/redux/AuthSlice/SignUp";
import { deleteTravelById, getTravels } from "@/redux/TravelSlice/TravelSlice";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import UpdateItinerary from "./UpdateItinerary";
import { Button } from "../ui/button";

type Props = {
  fromdate: Date | undefined;
  todate: Date | undefined;
};

const ShowPlans = ({ fromdate, todate }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getTravels(currentUser.id));
    }
  }, [currentUser, dispatch]);

  const plans = useSelector((state: RootState) => state.travel.travels);

  const handleItineraryClick = (id: string | undefined) => () => {
    router.push(`/itinerary/${id}`);
  };

  const filteredPlans = plans.filter((plan) => {
    const planStartDate = new Date(plan.startdate!);
    const planEndDate = new Date(plan.enddate!);

    if (!fromdate && !todate) {
      return true; // Show all plans if no date range is selected
    }

    // If both fromdate and todate are selected, check if the itinerary falls within the range
    if (fromdate && todate) {
      return (
        isWithinInterval(planStartDate, { start: fromdate, end: todate }) ||
        isWithinInterval(planEndDate, { start: fromdate, end: todate }) ||
        (isBefore(planStartDate, fromdate) && isAfter(planEndDate, todate))
      );
    }

    // If only fromdate is selected, check if the plan ends after the fromdate
    if (fromdate) {
      return isAfter(planEndDate, fromdate);
    }

    // If only todate is selected, check if the plan starts before the todate
    if (todate) {
      return isBefore(planStartDate, todate);
    }

    return true; // Fallback to show the plan if no filtering criteria apply
  });

  const handleBudgetClick = (id: string | undefined) => () => {
    router.push(`/home/expense-tracking/${id}`);
  };
  return (
    <div className="grid grid-cols-4 gap-4 w-fit">
      {filteredPlans.length > 0 ? (
        filteredPlans.map((plan) => (
          <div key={plan.id}>
            <Card className="bg-[#f2f6f9] p-4 border rounded-md shadow-sm relative w-[20vw]">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <div className="flex gap-4">
                  <div>
                    <UpdateItinerary plan={plan} />
                  </div>
                  <div onClick={() => dispatch(deleteTravelById(plan.id!))}>
                    <RiDeleteBin6Line
                      className="cursor-pointer"
                      color="#eb597f"
                      size={20}
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 break-words w-full mt-2">
                {plan.description}
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <p>
                  <strong>Start Date: </strong>
                  {plan.startdate && format(new Date(plan.startdate), "PPP")}
                </p>
                <p>
                  <strong>End Date: </strong>
                  {plan.enddate && format(new Date(plan.enddate), "PPP")}
                </p>
              </div>
              <div className="mt-4">
                <strong>Budget: </strong> 20{" "}
              </div>
              <div className="my-4 flex justify-end mr-4">
              <Button className="rounded-full" onClick={handleBudgetClick(plan.id)}>
                Expense
              </Button>
              </div>
              <div onClick={handleItineraryClick(plan.id)}>
                <Button className="bg-[#50b3ea] hover:bg-[#50b3ea] hover:text-cyan-800 font-semibold rounded-tr-full w-full">
                  View Details
                </Button>
              </div>
            </Card>
          </div>
        ))
      ) : (
        <p>No plans available.</p>
      )}
    </div>
  );
};

export default ShowPlans;
